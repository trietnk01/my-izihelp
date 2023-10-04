var express = require("express");
var router = express.Router();
module.exports = io => {
	router.use("/user", require("./user"));
	return router;
};
