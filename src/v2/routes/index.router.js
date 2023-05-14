import categories from "./category.router";
import brands from "./brand.router";
import products from "./product.router";
import upload from "./upload.router";
import auth from "./auth.router";
import inventories from "./inventory.router"
import insert from "./insert.router"
import cart from "./cart.router"
import order from "./order.router"
import option from "./option.router"
import optionValue from "./option-value.router"

const routes = (app) => {
	app.use("/api/v2/categories", categories);
	app.use("/api/v2/brands", brands);
	app.use("/api/v2/products", products);
	app.use("/api/v2/upload", upload);
	app.use("/api/v2/auth", auth);
	app.use("/api/v2/inventories", inventories);
	app.use("/api/v2/cart", cart)
	app.use("/api/v2/order", order)
	app.use("/api/v2/option", option)
	app.use("/api/v2/option-value", optionValue)
	// insert data
	app.use("/api/v2/insert", insert);
};

export default routes;
