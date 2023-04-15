import Product from "../models/product.model"
import Category from "../models/category.model"
import Brand from "../models/brand.model"
import Inventory from "../models/invetory.model"
import { cloudinary } from "../config/cloudinary.config"
import thinkpro from "../data//clone-thinkpro.json"
// import thinkpro from "../data/thinkpro.json"


// export async function insert(req, res, next) {
// 	try {
// 		// api chỉnh sửa data trước khi đẩy lên mongodb
// 		let dataChange = thinkpro.categories
// 		dataChange = await Promise.all(dataChange.map(async (item) => {
// 			let brands = []
// 			let products = []

// 			let imgCategory = ""

// 			try {
// 				imgCategory = await cloudinary.uploader.upload(item.image, {
// 					folder: "thinkpro/categories",
// 					filename_override: "thumbnail"
// 				})
// 			} catch (error) {

// 			}

// 			// upload ảnh thương hiệu
// 			if (item.brands) {
// 				brands = await Promise.all(item.brands.map(async (brand) => {
// 					let children = []
// 					let imgBrand = ""

// 					try {
// 						imgBrand = await cloudinary.uploader.upload(brand.image, {
// 							folder: "thinkpro/brands",
// 							filename_override: "brand",
// 						})
// 					} catch (error) {

// 					}

// 					if (brand.children) {
// 						children = await Promise.all(brand.children.map(async (subBrand) => {
// 							let imgBrandSub = ""
// 							try {
// 								imgBrandSub = await cloudinary.uploader.upload(subBrand.image, {
// 									folder: "thinkpro/brands",
// 									filename_override: "brand",
// 								})
// 							} catch (error) {

// 							}

// 							return {
// 								name: subBrand.name,
// 								slug: subBrand.slug,
// 								thumbnail: {
// 									path: imgBrandSub?.secure_url,
// 									filename: imgBrandSub?.public_id,
// 								},
// 								desc: subBrand.desc,
// 							}
// 						}))
// 					}

// 					return {
// 						name: brand.name,
// 						slug: brand.slug,
// 						thumbnail: {
// 							path: imgBrand?.secure_url,
// 							filename: imgBrand?.public_id,
// 						},
// 						desc: brand.desc,
// 						children
// 					}
// 				}))
// 			}

// 			// upload ảnh sản phẩm
// 			if (item.products) {
// 				products = await Promise.all(item.products.map(async (product) => {
// 					let assets = []
// 					let imgProduct

// 					try {
// 						imgProduct = await cloudinary.uploader.upload(product.thumbnail, {
// 							folder: "thinkpro/products",
// 							filename_override: "assets",
// 						})
// 					} catch (error) {

// 					}

// 					if (product.images) {
// 						assets = await Promise.all(product.images.map(async (i) => {
// 							let image
// 							try {
// 								image = await cloudinary.uploader.upload(i, {
// 									folder: "thinkpro/products",
// 									filename_override: "assets",
// 								})
// 							} catch (error) {

// 							}

// 							return {
// 								path: image?.secure_url,
// 								filename: image?.public_id,
// 							}
// 						}))
// 					}

// 					return {
// 						name: product.name,
// 						slug: product.slug,
// 						price: product.giagia,
// 						discount: product.price,
// 						attributes: product.attributes,
// 						desc: product.description,
// 						thumbnail: {
// 							path: imgProduct?.secure_url,
// 							filename: imgProduct?.public_id,
// 						},
// 						assets
// 					}
// 				}))
// 			}

// 			return {
// 				name: item.name,
// 				slug: item.slug,
// 				thumbnail: {
// 					path: imgCategory?.secure_url,
// 					filename: imgCategory?.public_id,
// 				},
// 				desc: item.desc,
// 				brands: brands,
// 				products: products
// 			}
// 		}))

// 		return res.json({
// 			data: dataChange
// 		})
// 	} catch (error) {
// 		next(error)
// 	}
// }

export async function insert(req, res, next) {
	try {
		const { data } = thinkpro

		for (let category of data) {
			const products = category.products
			const brands = category.brands
			let brandIds = []
			let productIds = []
			const CategoryOpp = await Category.create({
				name: category?.name,
				slug: category?.slug,
				image: category?.thumbnail,
				description: category?.desc
			})

			for (let product of products) {
				const ProductOpp = await Product.create({
					name: product?.name,
					slug: product?.slug || product?.name,
					price: Number(product?.price?.split(".")?.join("") || 10000000),
					discount: Number(product?.discount?.split(".")?.join("") || 8000000),
					thumbnail: product?.thumbnail,
					assets: product?.assets,
					description: product?.desc,
					attributes: product?.attributes,
					status: 0,
					categoryId: CategoryOpp?._id,
					brandId: brandIds[0]
				})

				const InventoryOpp = await Inventory.create({
					productId: ProductOpp?._id,
					quantity: 1000,
				})

				productIds.push(ProductOpp?._id)
			}

			for (let brand of brands) {
				const children = brand.children
				const BrandParent = await Brand.create({
					name: brand?.name,
					slug: brand?.slug,
					image: brand?.thumbnail,
					description: brand?.desc,
					parentId: null,
					categoryIds: [
						CategoryOpp?._id
					],
					products: productIds
				})

				if (children.length > 0) {
					await Promise.all(children.map(async (item) => {
						await Brand.create({
							name: item?.name,
							slug: item?.slug,
							image: item?.thumbnail,
							description: item?.desc,
							parentId: BrandParent?._id
						})
					}))
				}
				brandIds.push(Brand?._id)
			}

			CategoryOpp.brands = brandIds
			CategoryOpp.products = productIds
			await CategoryOpp.save()
		}

		return res.json({
			data: data
		})

	} catch (error) {
		next(error)
	}
}