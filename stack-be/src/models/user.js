const query = require("@helpers/get-mysql-query");
module.exports = {
	create: item => {
		let colData = [];
		let questionData = [];
		let params = [];
		if (item.id) {
			colData.push("id");
			params.push(item.id);
			questionData.push("?");
		}
		if (item.firstname) {
			colData.push("firstname");
			params.push(item.firstname);
			questionData.push("?");
		}
		if (item.lastname) {
			colData.push("lastname");
			params.push(item.lastname);
			questionData.push("?");
		}
		if (item.age) {
			colData.push("age");
			params.push(item.age);
			questionData.push("?");
		}
		if (item.coordinate) {
			colData.push("coordinate");
			params.push(item.coordinate);
			questionData.push("?");
		}
		const colTxt = colData.join(",");
		const questionTxt = questionData.join(",");
		const sql = "insert into user (" + colTxt + ") values (" + questionTxt + ")";
		return query(sql, params);
	},
	update: item => {
		let colData = [];
		let params = [];
		if (item.firstname) {
			colData.push("firstname = ?");
			params.push(item.firstname);
		}
		if (item.lastname) {
			colData.push("lastname = ?");
			params.push(item.lastname);
		}
		if (item.age) {
			colData.push("age = ?");
			params.push(item.age);
		}
		if (item.coordinate) {
			colData.push("coordinate = ?");
			params.push(item.coordinate);
		}
		params.push(item.id);
		const colTxt = colData.join(" , ");
		const sql = "update user set " + colTxt + " where id = ?";
		return query(sql, params);
	}
};
