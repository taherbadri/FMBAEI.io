// const loginForm = document.querySelector(".login-form");

// const login = async (e) => {
// 	const res = await fetch("/user/login", {
// 		method: "POST",
// 		headers: {
// 			"content-type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			its: document.querySelector("#its").value,
// 			password: document.querySelector("#password").value,
// 		}),
// 	});
// 	const data = await res.text();
// 	console.log(data);
// };

// loginForm.addEventListener("submit", login);

const routes = {
	userDashboard: "/user/dashboard",
	admin: {
		adminDashboard: "/admin/access/dashboard",
		totalThali: "/admin/access/dashboard/thali",
	},
};

const feedbackForm = document.querySelector(".feedback");
const totalThali = document.querySelector(".total");

const feedback = async (e) => {
	e.preventDefault();

	const res = await fetch(routes.userDashboard, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			thaliNumber: document.querySelector("#thaliNumber").value,
			sabeel: document.querySelector("#sabeel").value,
			qty: document.querySelector(`input[name="qty"]:checked`).value,
			comment: document.querySelector("#comment").value,
		}),
	});

	const data = await res.json();
	// console.log(data);
	const div = document.createElement("div");
	const text = document.createTextNode(data.msg);
	div.className = data.err
		? "text-center mb-3 p-3 rounded-3 shadow text-bg-danger"
		: "text-center mb-3 p-3 rounded-3 shadow text-bg-success";

	div.appendChild(text);

	const formContainer = document.querySelector(".form-container");

	formContainer.insertBefore(div, feedbackForm);

	document.querySelector("#comment").value = "";

	setTimeout(() => {
		div.remove();
	}, 3000);
};

const fetchThali = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	const res = await fetch(routes.admin.totalThali);
	const data = await res.json();
	// console.log(data);
	document.querySelector(".thali-data").innerHTML = `
	<th>Date</th>
	<th>Sabeel</th>
	<th>Name</th>
	<th>Thali Number</th>
	<th>Thali Quantity</th>
	<th>Comments</th>`;
	data.thali.forEach((currentItem) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
		<td>${new Date(currentItem.createdAt)
			.toString()
			.split(" ")
			.splice(0, 4)
			.join(" ")}</td>
		<td>${currentItem.sabeel}</td>
		<td>${currentItem.name}</td>
		<td>${currentItem.thaliNumber}</td>
		<td>${currentItem.qty}</td>
		<td>${currentItem.comment}</td>`;
		document.querySelector(".thali-data").firstElementChild.appendChild(tr);
	});
};

const dateFilter = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	const date = document.querySelector("#date").value;
	const res = await fetch(routes.admin.totalThali, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			date,
		}),
	});
	const data = await res.json();
	document.querySelector(".thali-data").innerHTML = `
	<th>Date</th>
	<th>Sabeel</th>
	<th>Name</th>
	<th>Thali Number</th>
	<th>Thali Quantity</th>
	<th>Comments</th>`;
	data.thali.forEach((currentItem) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
		<td>${new Date(currentItem.createdAt)
			.toString()
			.split(" ")
			.splice(0, 4)
			.join(" ")}</td>
		<td>${currentItem.sabeel}</td>
		<td>${currentItem.name}</td>
		<td>${currentItem.thaliNumber}</td>
		<td>${currentItem.qty}</td>
		<td>${currentItem.comment}</td>`;
		document.querySelector(".thali-data").firstElementChild.appendChild(tr);
	});
};

const page = () => {
	switch (window.location.pathname) {
		case routes.userDashboard:
			document.querySelector(".logout").addEventListener("click", async (e) => {
				const res = await fetch("/user/logout", { method: "POST" });
				const data = await res.json();
			});
			feedbackForm.addEventListener("submit", feedback);
			break;
		case routes.admin.adminDashboard:
			fetchThali();
			totalThali.addEventListener("click", fetchThali);
			document
				.querySelector(".submit-date")
				.addEventListener("click", dateFilter);
			break;

		default:
			break;
	}
};

// scanner ---
console.log(document.getElementById("main").style.width);
console.log(window.screen.height + " x " + window.screen.width * 0.5);
const scanner = new Html5QrcodeScanner("reader", {
	qrbox: {
		width: window.screen.width * 0.5,
		height: window.screen.width * 0.5,
	},
	fps: 20,
});

const success = async (result) => {
	console.log(result + " : this is result");
	const id = result;
	// const id = result.split('?id=')[1]
	if (id) {
		const res = await fetch("/scanner", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				id,
			}),
		});
		const data = await res.json();
		console.log(data.msg + " : this is data");
		document.querySelector("#result").innerHTML = data.msg;
	}
	console.log("id not valid");
};

const error = (err) => {
	console.log(err);
};

scanner.render(success, error);
// --- scanner

document.addEventListener("DOMContentLoaded", page);
