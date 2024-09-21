const express = require("express");
const router = express.Router();
const productcontroller = require('../controllers/productController');

router.post("/addproduct", productcontroller.addProduct);

router.patch("/updateproduct", productcontroller.updateProduct);

router.get("/hotprod", productcontroller.getHotProducts);

router.get("/latest", productcontroller.getLatestProducts);

router.get("/featured", productcontroller.getFeaturedProducts);

router.get("/all", productcontroller.getAllProducts); 

router.get("/:productid", productcontroller.getProductById); 

router.delete("deleteproduct", productcontroller.deleteProduct);

module.exports = router;
