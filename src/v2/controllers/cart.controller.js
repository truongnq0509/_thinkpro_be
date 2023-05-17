import Cart from "../models/cart.model"
import cartSchema from "../validations/cart.validation"
import Inventory from "../models/invetory.model"
import createError from "http-errors"


export async function get(req, res, next) {
	try {
		const { _id: userId } = req.user

		const cart = await Cart.findOne({
			userId
		}).select('products').populate({
			path: "products.productId",
			select: ["name", "thumbnail", "price", "discount"]
		})

		if (!cart) {
			throw createError.BadRequest('Giỏ hàng không tồn tại!!!')
		}

		const count = cart.products.reduce((acc, product) => {
			return acc += product.quantity
		}, 0)

		return res.json({
			message: "successfully",
			data: {
				count
			}
		})
	} catch (error) {
		next(error)
	}
}

export async function addToCart(req, res, next) {
	try {
		const { error } = cartSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const { productId, quantity } = req.body
		const { _id: userId } = req.user

		const cart = await Cart.findOne({
			userId
		})

		const stock = await Inventory.findOne({
			productId,
		})

		if (cart) {
			const product = cart.products.find((product) => product.productId == productId)
			if (product) {
				product.quantity = quantity
				if (stock.quantity <= quantity) {
					product.quantity = stock.quantity
				}
				cart.products[product.productId] = product
			} else {
				let newQuantity = quantity
				if (stock.quantity <= quantity) {
					newQuantity = stock.quantity
				}
				cart.products.push({
					productId,
					quantity: newQuantity
				})
			}

			// cập nhật lại giỏ hàng
			await cart.save()
			const updateCart = await Cart.findOne({
				userId
			}).select(['userId', 'products']).populate({
				path: "products.productId",
				select: ["name", "thumbnail", "price", "discount"]
			})

			return res.status(201).json({
				message: "successfully",
				data: updateCart
			})

		} else {
			let newQuantity = quantity
			if (stock.quantity <= quantity) {
				newQuantity = stock.quantity
			}

			// tạo mới giỏ hàng
			const newCart = await Cart.findOneAndUpdate({
				userId
			}, {
				$push: {
					products: {
						productId,
						quantity: newQuantity
					}
				}
			}, {
				new: true,
				upsert: true
			}).select(['userId', 'products']).populate({
				path: "products.productId",
				select: ["name", "thumbnail", "price", "discount"]
			})

			return res.status(201).json({
				message: "successfully",
				data: newCart
			})
		}
	} catch (error) {
		next(error)
	}
}

export async function removeCart(req, res, next) {
	try {
		const { _id: userId } = req.user

		const cart = await Cart.findOne({
			userId
		})

		if (!cart) {
			throw createError.BadRequest('Cart not found!!!')
		}

		await Cart.deleteOne({
			userId
		})

		return res.json({
			message: "successfully",
		})
	} catch (error) {
		next(error)
	}
}

export async function removeProduct(req, res, next) {
	try {
		const { productId } = req.params
		const { _id: userId } = req.user

		const cart = await Cart.findOne({
			userId
		})

		if (!cart) {
			throw createError.BadRequest('Giỏ hàng không tồn tại!!!')
		}

		// xóa sản phẩm ra khỏi giỏ hàng
		const updateCart = await Cart.findOneAndUpdate({
			userId
		}, {
			$pull: {
				products: {
					productId,
				}
			}
		}, {
			new: true
		})

		return res.json({
			message: "successfully",
			data: updateCart
		})
	} catch (error) {
		next(error)
	}
}