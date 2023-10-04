var express = require("express");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");
var UserModel = require("@models/user");
const query = require("@helpers/get-mysql-query");
/*
1. Add user
*/
router.post("/add", (req, res) => {
	let dataMsg = [];
	try {
		let item = Object.assign({}, req.body);
		let checked = true;
		if (!item["firstname"]) {
			checked = false;
			dataMsg.push("Firstname is required");
		}
		if (!item.lastname) {
			checked = false;
			dataMsg.push("Lastname is required");
		}
		if (!item.age) {
			checked = false;
			dataMsg.push("Age is required");
		} else {
			if (parseInt(item.age) < 1 || parseInt(item.age) > 100) {
				checked = false;
				dataMsg.push("Age must be between 1 to 100");
			}
		}
		if (!item.coordinate) {
			checked = false;
			dataMsg.push("Coordinate is required");
		}
		if (checked) {
			item["id"] = uuidv4();
			UserModel.create(item)
				.then(rs => {
					if (parseInt(rs.affectedRows) > 0) {
						res.status(200).json({ status: true });
					} else {
						res.status(200).json({ status: false });
					}
				})
				.catch(err => {
					dataMsg.push(err.message);
					res.status(200).json({ status: false, error: dataMsg });
				});
		} else {
			res.status(200).json({ status: false, error: dataMsg });
		}
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
/*
2. Get user information
*/
router.get("/read", async (req, res) => {
	let dataMsg = [];
	try {
		const item = Object.assign({}, req.query);
		const id = item.id;
		const sql = "SELECT id , firstname , lastname , age , coordinate  FROM user WHERE id = ?";
		query(sql, [id], (err, result) => {
			if (result && result.length > 0) {
				res.status(200).json({ status: true, item: result[0] });
			} else {
				dataMsg.push(err.message);
				res.status(200).json({ status: false, error: dataMsg });
			}
		});
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
/*
3. Get user information
*/
router.get("/search", async (req, res) => {
	let dataMsg = [];
	try {
		const item = Object.assign({}, req.query);
		let where = [];
		let params = [];
		let queryWhere = "";
		if (item.keyword) {
			where.push(`firstname LIKE '%${item.keyword}%'`);
			where.push(`lastname LIKE '%${item.keyword}%'`);
			queryWhere = ` ( ${where.join(" OR ")} ) AND `;
		}
		const sql = "SELECT id , firstname , lastname , age , coordinate FROM user WHERE " + queryWhere + " 1 = 1 order by firstname desc";
		query(sql, params, (err, result) => {
			if (result && result.length > 0) {
				res.status(200).json({ status: true, items: result });
			} else {
				dataMsg.push(err.message);
				res.status(200).json({ status: false, error: dataMsg });
			}
		});
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
/*
4. Edit user information
*/
router.post("/edit/:id", (req, res) => {
	let dataMsg = [];
	try {
		let item = Object.assign({}, req.body);
		if (req.params.id) {
			item["id"] = req.params.id;
		}
		let checked = true;
		if (checked) {
			UserModel.update(item)
				.then(rs => {
					if (parseInt(rs.affectedRows) > 0) {
						res.status(200).json({ status: true });
					} else {
						res.status(200).json({ status: false });
					}
				})
				.catch(err => {
					dataMsg.push(err.message);
					res.status(200).json({ status: false, error: dataMsg });
				});
		} else {
			res.status(200).json({ status: false, error: dataMsg });
		}
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
/*
5. Delete user by id
*/
router.delete("/delete/:id", async (req, res) => {
	let dataMsg = [];
	try {
		const id = req.params.id ? req.params.id : "";
		const sql = "delete from user where id = ?";
		query(sql, [id], (err, dataResult) => {
			if (dataResult.affectedRows) {
				dataMsg.push("Delete successfully");
				res.status(200).json({ status: true });
			} else {
				dataMsg.push("Delete fail");
				res.status(200).json({ status: false });
			}
		});
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
/*
7. Search advanced user
*/
router.get("/locate", async (req, res) => {
	let dataMsg = [];
	try {
		const item = Object.assign({}, req.query);
		let where = [];
		let params = [];
		let queryWhere = "";
		if (item.keyword) {
			where.push(`firstname LIKE '%${item.keyword}%'`);
			where.push(`lastname LIKE '%${item.keyword}%'`);
			queryWhere = ` ( ${where.join(" OR ")} ) AND `;
		}
		const sql = "SELECT id , firstname , lastname , age , coordinate FROM user WHERE " + queryWhere + " 1 = 1 order by firstname desc";
		query(sql, params, (err, result) => {
			if (result && result.length > 0) {
				res.status(200).json({ status: true, items: result });
			} else {
				dataMsg.push(err.message);
				res.status(200).json({ status: false, error: dataMsg });
			}
		});
	} catch (err) {
		dataMsg.push(err.message);
		res.status(200).json({ status: false, error: dataMsg });
	}
});
module.exports = router;
