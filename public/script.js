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
const fullThali = document.querySelector(".full");
const halfThali = document.querySelector(".half");

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

const createTable = (data) => {
	if (data.thali.length === 0) {
		return (document.querySelector(
			".thali-data"
		).innerHTML = `<p class="text-center text-danger my-3">No Data Available</p>`);
	}
	document.querySelector(".thali-data").innerHTML = `
	<th>Date</th>
	<th>Sabeel</th>
	<th>Name</th>
	<th>Thali Number</th>
	<th>Thali Quantity</th>`;
	// <th>Comments</th>`;

	// console.log(data);
	data.thali.forEach((currentItem) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
		<td>${new Date(currentItem.markedAt)
			.toString()
			.split(" ")
			.splice(0, 4)
			.join(" ")}</td>
		<td>${currentItem.sabeel}</td>
		<td>${currentItem.name}</td>
		<td>${currentItem.thaliNumber}</td>
		<td>${currentItem.thali}</td>`;
		// <td>${currentItem.comment}</td>`;
		document.querySelector(".thali-data").firstElementChild.appendChild(tr);
	});
};

const fetchThali = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	const res = await fetch(routes.admin.totalThali);
	const data = await res.json();
	document.querySelector(".thali-data").innerHTML = "";
	const resFull = await fetch(`${routes.admin.totalThali}/full`);
	const dataFull = await resFull.json();
	document.querySelector(".thali-data").innerHTML = "";
	const resHalf = await fetch(`${routes.admin.totalThali}/half`);
	const dataHalf = await resHalf.json();
	// console.log(data);
	createTable(data);
	document.querySelector(".total-thali").innerHTML = data.nbThali;
	document.querySelector(".full-thali").innerHTML = dataFull.nbThali;
	document.querySelector(".half-thali").innerHTML = dataHalf.nbThali;
};
const fetchFullThali = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	const res = await fetch(`${routes.admin.totalThali}/full`);
	const data = await res.json();
	// console.log(data + "full thali");
	createTable(data);
	document.querySelector(".full-thali").innerHTML = data.nbThali;
};
const fetchHalfThali = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	const res = await fetch(`${routes.admin.totalThali}/half`);
	const data = await res.json();
	// console.log(data + "half thali");
	createTable(data);
	document.querySelector(".half-thali").innerHTML = data.nbThali;
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
	if (data.err) {
		return (document.querySelector(
			".thali-data"
		).innerHTML = `<p class="text-center text-danger my-3">${data.msg}</p>`);
	}
	document.querySelector(".thali-data").innerHTML = `
	<th>Date</th>
	<th>Sabeel</th>
	<th>Name</th>
	<th>Thali Number</th>
	<th>Thali Quantity</th>`;
	// <th>Comments</th>`;
	// console.log(data);
	data.thali.forEach((currentItem) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
		<td>${new Date(currentItem.markedAt)
			.toString()
			.split(" ")
			.splice(0, 4)
			.join(" ")}</td>
		<td>${currentItem.sabeel}</td>
		<td>${currentItem.name}</td>
		<td>${currentItem.thaliNumber}</td>
		<td>${currentItem.thali}</td>`;
		// <td>${currentItem.comment}</td>`;
		document.querySelector(".thali-data").firstElementChild.appendChild(tr);
	});
};

const page = () => {
	switch (window.location.pathname) {
		case routes.userDashboard:
			document.querySelector(".logout").addEventListener("click", async (e) => {
				const res = await fetch("/user/logout", {
					method: "POST",
				});
				const data = await res.json();
			});
			feedbackForm.addEventListener("submit", feedback);
			break;
		case routes.admin.adminDashboard:
			fetchThali();
			totalThali.addEventListener("click", fetchThali);
			fullThali.addEventListener("click", fetchFullThali);
			halfThali.addEventListener("click", fetchHalfThali);
			document
				.querySelector(".submit-date")
				.addEventListener("click", dateFilter);
			break;

		case "/scanner":
			// scanner ---
			// console.log(window.screen.height + " x " + window.screen.width * 0.5);
			const scanner = new Html5QrcodeScanner("reader", {
				qrbox: {
					width: window.screen.width * 0.5,
					height: window.screen.width * 0.5,
				},
				fps: 10,
				rememberLastUsedCamera: true,
			});

			const success = async (result) => {
				const id = result;
				// const id = result.split('?id=')[1]
				scanner.pause({ shouldPauseVideo: true });
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
					const div = document.createElement("div");
					const text = document.createTextNode(data.msg);
					div.className = data.err
						? "text-center mb-3 p-3 rounded-3 shadow text-bg-danger"
						: "text-center mb-3 p-3 rounded-3 shadow text-bg-success";

					div.appendChild(text);
					document
						.querySelector("#main")
						.insertBefore(div, document.querySelector("#reader"));
					setTimeout(() => {
						div.remove();
						scanner.resume();
					}, 2000);
				}
			};

			const error = (err) => {
				console.log(err);
			};

			scanner.render(success, error);
			// --- scanner

			break;

		default:
			break;
	}
};

document.addEventListener("DOMContentLoaded", page);
