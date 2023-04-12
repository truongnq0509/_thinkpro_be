import Product from "../models/product.model"
import Category from "../models/category.model"
import Brand from "../models/brand.model"
import { cloudinary } from "../config/cloudinary.config"
import thinkpro from "../data/clone-thinkpro.json"


export async function insert(req, res, next) {
	try {
		// api chỉnh sửa data trước khi đẩy lên mongodb
		// let dataChange = data.categories
		// dataChange = await Promise.all(dataChange.map(async (item) => {
		// 	let brands = []
		// 	let products = []

		// 	let imgCategory = ""

		// 	try {
		// 		imgCategory = await cloudinary.uploader.upload(item.image, {
		// 			folder: "thinkpro/categories",
		// 			filename_override: "thumbnail"
		// 		})
		// 	} catch (error) {

		// 	}

		// 	// upload ảnh thương hiệu
		// 	if (item.brands) {
		// 		brands = await Promise.all(item.brands.map(async (brand) => {
		// 			let children = []
		// 			let imgBrand = ""

		// 			try {
		// 				imgBrand = await cloudinary.uploader.upload(brand.image, {
		// 					folder: "thinkpro/brands",
		// 					filename_override: "brand",
		// 				})
		// 			} catch (error) {

		// 			}

		// 			if (brand.children) {
		// 				children = await Promise.all(brand.children.map(async (subBrand) => {
		// 					let imgBrandSub = ""
		// 					try {
		// 						imgBrandSub = await cloudinary.uploader.upload(subBrand.image, {
		// 							folder: "thinkpro/brands",
		// 							filename_override: "brand",
		// 						})
		// 					} catch (error) {

		// 					}

		// 					return {
		// 						name: item.name,
		// 						slug: item.slug,
		// 						thumbnail: {
		// 							path: imgBrandSub?.secure_url,
		// 							filename: imgBrandSub?.public_id,
		// 						},
		// 						desc: item.desc,
		// 					}
		// 				}))
		// 			}

		// 			return {
		// 				name: item.name,
		// 				slug: item.slug,
		// 				thumbnail: {
		// 					path: imgBrand?.secure_url,
		// 					filename: imgBrand?.public_id,
		// 				},
		// 				desc: item.desc,
		// 				children
		// 			}
		// 		}))
		// 	}

		// 	// upload ảnh sản phẩm
		// 	if (item.products) {
		// 		products = await Promise.all(item.products.map(async (product) => {
		// 			let assets = []
		// 			let imgProduct

		// 			try {
		// 				imgProduct = await cloudinary.uploader.upload(product.thumbnail, {
		// 					folder: "thinkpro/products",
		// 					filename_override: "assets",
		// 				})
		// 			} catch (error) {

		// 			}

		// 			if (product.images) {
		// 				assets = await Promise.all(product.images.map(async (i) => {
		// 					let image
		// 					try {
		// 						image = await cloudinary.uploader.upload(i, {
		// 							folder: "thinkpro/products",
		// 							filename_override: "assets",
		// 						})
		// 					} catch (error) {

		// 					}

		// 					return {
		// 						path: image?.secure_url,
		// 						filename: image?.public_id,
		// 					}
		// 				}))
		// 			}

		// 			return {
		// 				name: product.name,
		// 				slug: product.slug,
		// 				price: product.giagia,
		// 				discount: product.price,
		// 				attributes: product.attributes,
		// 				desc: product.description,
		// 				thumbnail: {
		// 					path: imgProduct?.secure_url,
		// 					filename: imgProduct?.public_id,
		// 				},
		// 				assets
		// 			}
		// 		}))
		// 	}

		// 	return {
		// 		name: item.name,
		// 		slug: item.slug,
		// 		thumbnail: {
		// 			path: imgCategory?.secure_url,
		// 			filename: imgCategory?.public_id,
		// 		},
		// 		desc: item.desc,
		// 		brands: brands,
		// 		products: products
		// 	}
		// }))

		const { data } = thinkpro

	} catch (error) {
		console.log(error)
		next(error)
	}
}