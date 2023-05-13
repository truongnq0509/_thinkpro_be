import categories from "./category.router";
import brands from "./brand.router";
import products from "./product.router";
import upload from "./upload.router";
import auth from "./auth.router";
import inventories from "./inventory.router"
import insert from "./insert.router"
import cart from "./cart.router"
import order from "./order.router"

const routes = (app) => {
	app.use("/api/v1/categories", categories);
	app.use("/api/v1/brands", brands);
	app.use("/api/v1/products", products);
	app.use("/api/v1/upload", upload);
	app.use("/api/v1/auth", auth);
	app.use("/api/v1/inventories", inventories);
	app.use("/api/v1/cart", cart)
	app.use("/api/v1/order", order)
	// insert data
	app.use("/api/v1/insert", insert);
};

export default routes;
