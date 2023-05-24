import Order from "../models/order.model"
import Cart from "../models/cart.model"
import Inventory from "../models/invetory.model"
import Product from "../models/product.model"
import createError from "http-errors"
import axios from "axios"
import crypto from "crypto"
import orderSchema from "../validations/order.validation"
import dotenv from "dotenv"
import querystring from "query-string"
import sortObject from 'sortobject'
import dateFormat from "dateformat"

dotenv.config()


export async function get(req, res, next) {
	try {
		const { id } = req.params
		const { _page = 1, _sort = "createdAt", _order = "asc", _limit = 10 } = req.query;
		const options = {
			page: _page,
			limit: _limit,
			sort: {
				[_sort]: _order == "desc" ? -1 : 1,
			},
			populate: "userId",
			select: ["-deleted", "-deletedAt"],
		};


		if (id) {
			const order = await Order.findById(id)

			if (!order) {
				throw createError.BadRequest('Not found!!!')
			}

			return res.json({
				message: "successfully",
				data: order
			})
		} else {
			const {
				docs,
				totalPages,
				totalDocs,
				limit,
				hasPrevPage,
				pagingCounter,
				hasNextPage,
				page,
				nextPage,
				prevPage,
			} = await Order.paginate({}, options);

			return res.json({
				message: "successfully",
				data: docs,
				paginate: {
					limit,
					totalDocs,
					totalPages,
					page,
					pagingCounter,
					hasPrevPage,
					hasNextPage,
					prevPage,
					nextPage,
				},
			});
		}
	} catch (error) {
		next(error)
	}
}

export async function create(req, res, next) {
	try {
		const { error } = orderSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const { cartId, payment, shipping } = req.body
		const { _id: userId } = req.user
		const cart = await Cart.findById(cartId)

		if (!cart) {
			throw createError.InternalServerError('Bạn không có sản phẩm nào trong giỏ hàng')
		}

		let products = await Promise.all(cart.products.map(async (item) => {
			const product = await Product.findOne({
				_id: item.productId
			})

			// giảm sản phẩm trong kho
			const stock = await Inventory.findOne({
				productId: item.productId
			})
			stock.quantity -= item.quantity
			await stock.save()

			return {
				_id: product._id,
				name: product.name,
				price: product.price,
				discount: product.discount,
				thumbnail: product.thumbnail,
				quantity: item.quantity
			}
		}))

		// tính tổng tiền của một đơn hàng
		const bill = products.reduce((acc, product) => {
			let total = product.price * product.quantity

			if (product.discount) {
				total = product.discount * product.quantity
			}
			return acc += total
		}, 0)

		const order = await Order.create({
			userId,
			payment,
			shipping,
			products,
			bill
		})

		await Cart.findByIdAndDelete({ _id: cartId })

		return res.status(201).json({
			message: "successfully",
			data: order
		})
	} catch (error) {
		next(error)
	}
}

export async function payMomo(req, res, next) {
	try {
		const { bill, orderId: _id } = req.body
		var partnerCode = "MOMO";
		var accessKey = "F8BBA842ECF85";
		var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
		var requestId = partnerCode + new Date().getTime();
		var orderId = requestId;
		var orderInfo = "Thanh Toán MoMo";
		var redirectUrl = process.env.FE_URL + `/thanks?_id=${_id}`;
		var ipnUrl = "https://callback.url/notify";
		var amount = bill;
		var requestType = "payWithATM"
		var extraData = ""; //pass empty value if your merchant does not have stores
		var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
		var signature = crypto.createHmac('sha256', secretkey)
			.update(rawSignature)
			.digest('hex');
		const requestBody = {
			partnerCode: partnerCode,
			accessKey: accessKey,
			requestId: requestId,
			amount: amount,
			orderId: orderId,
			orderInfo: orderInfo,
			redirectUrl: redirectUrl,
			ipnUrl: ipnUrl,
			extraData: extraData,
			requestType: requestType,
			signature: signature,
			lang: 'en'
		}
		const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
			headers: {
				port: 443,
			},
			withCredentials: true
		})

		return res.status(201).json({
			message: "successfully",
			data: {
				url: response?.data?.payUrl
			}
		})
	} catch (error) {
		next(error)
	}
}

export async function payVnPay(req, res, next) {
	try {
		const { bill, orderId: _id } = req.body
		var ipAddr = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
		var tmnCode = process.env.VNP_TMNCODE;
		var secretKey = process.env.VNP_HASHSECRET;
		var vnpUrl = process.env.VNP_URL;
		var returnUrl = process.env.FE_URL + `/thanks?_id=${_id}`;
		var date = new Date();
		var createDate = dateFormat(date, 'yyyymmddHHmmss');
		var orderId = dateFormat(date, 'HHmmss');
		var amount = bill;
		var bankCode = "NCB";

		var orderInfo = "Nội dung thanh toán";
		var orderType = "billpayment";
		var locale = "vn";
		if (locale === null || locale === '') {
			locale = 'vn';
		}
		var currCode = 'VND';
		var vnp_Params = {};
		vnp_Params['vnp_Version'] = '2.1.0';
		vnp_Params['vnp_Command'] = 'pay';
		vnp_Params['vnp_TmnCode'] = tmnCode;
		// vnp_Params['vnp_Merchant'] = ''
		vnp_Params['vnp_Locale'] = locale;
		vnp_Params['vnp_CurrCode'] = currCode;
		vnp_Params['vnp_TxnRef'] = orderId;
		vnp_Params['vnp_OrderInfo'] = orderInfo;
		vnp_Params['vnp_OrderType'] = orderType;
		vnp_Params['vnp_Amount'] = amount * 100;
		vnp_Params['vnp_ReturnUrl'] = returnUrl;
		vnp_Params['vnp_IpAddr'] = ipAddr;
		vnp_Params['vnp_CreateDate'] = createDate;
		if (bankCode !== null && bankCode !== '') {
			vnp_Params['vnp_BankCode'] = bankCode;
		}

		vnp_Params = sortObject(vnp_Params);

		var signData = querystring.stringify(vnp_Params, { encode: false });
		var hmac = crypto.createHmac("sha512", secretKey);
		var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
		vnp_Params['vnp_SecureHash'] = signed;
		vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

		return res.status(201).json({
			message: "successfully",
			data: {
				url: vnpUrl
			}
		})
	} catch (error) {
		next(error)
	}
}

export async function getOrderByUser(req, res, next) {
	try {
		const { _page = 1, _sort = "createdAt", _order = "desc", _limit = 10 } = req.query;
		const options = {
			page: _page,
			limit: _limit,
			sort: {
				[_sort]: _order == "desc" ? -1 : 1,
			},
			select: ["-deleted", "-deletedAt"],
		};
		const { _id: userId } = req.user
		const {
			docs,
			totalPages,
			totalDocs,
			limit,
			hasPrevPage,
			pagingCounter,
			hasNextPage,
			page,
			nextPage,
			prevPage,
		} = await Order.paginate({ userId }, options);

		if (!docs) {
			throw createError.BadRequest("Not found!")
		}

		return res.json({
			message: "successfully",
			data: docs,
			paginate: {
				limit,
				totalDocs,
				totalPages,
				page,
				pagingCounter,
				hasPrevPage,
				hasNextPage,
				prevPage,
				nextPage,
			},
		});
	} catch (error) {
		next(error)
	}
}

export async function cancelOrder(req, res, next) {
	try {
		const { id } = req.params
		const order = await Order.findOne({
			_id: id
		})


		if (!order) {
			throw createError.BadRequest("Not found!!!")
		}

		const products = order.products

		for (let product of products) {
			const stock = await Inventory.findOne({
				productId: product._id
			})

			stock.quantity += product?.quantity
			await stock.save()
		}

		// xóa mềm đơn hàng đó đi
		order.status = "cancelled"
		order.createdAt = (new Date()).toISOString()
		await order.save()

		return res.json({
			message: "successfully"
		})
	} catch (error) {
		next(error)
	}
}

export async function orderStatus(req, res, next) {
	try {
		const { status } = req.body
		const { id } = req.params
		const order = await Order.findById(id)
		if (!order) {
			throw createError.BadRequest('Not found!')
		}

		if (status === 'cancelled') {
			for (let product of order.products) {
				const stock = await Inventory.findOne({
					productId: product.productId
				})
				stock.quantity += product.quantity
				await stock.save()
			}
		}

		order.status = status
		await order.save()

		return res.json({
			message: "successfully",
			data: order
		})
	} catch (error) {
		next(error)
	}
}

export async function updateOrder(req, res, next) {
	try {
		const { id } = req.params
		const order = await Order.findById(id)
		if (!order) {
			throw createError.BadRequest('Not found!')
		}

		const orderUpdate = await Order.findOneAndUpdate({
			_id: id,
		}, {
			$set: {
				payment: {
					methods: order?.payment?.methods,
					status: true,
					...req.body
				}
			}
		}, { new: true })

		return res.json({
			message: "successfully",
			data: orderUpdate
		})
	} catch (error) {
		next(error)
	}
}