import { Router } from "express";
import createProduct from "../../controllers/product/create-product.controller";
import getCompanyProducts from "../../controllers/product/get-all-compaies-products.controller";
import getProduct from "../../controllers/product/get-compaies-product.controller";
import updateProduct from "../../controllers/product/update-product.controller";
import deleteProduct from "../../controllers/product/delete-product.controller";

const productRoute = Router();

productRoute.post("/create", createProduct);
productRoute.get("/get/all", getCompanyProducts);
productRoute.get("/get/product/:productId", getProduct);
productRoute.patch("/update/product/:productId", updateProduct);
productRoute.delete("/delete/product/:productId", deleteProduct);

export { productRoute };
