const express = require("express");
const { getProductData,handleFileUpload } = require("../controllers/salesController");
const upload = require("../middlewares/uploadFiles");
const router=express.Router()

router.get("/getsales",getProductData)
router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;