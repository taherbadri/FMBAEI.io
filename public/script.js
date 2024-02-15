const routes = {
	userDashboard: "/user/dashboard",
	admin: {
		adminDashboard: "/admin/access/dashboard",
		totalThali: "/admin/access/dashboard/thali",
	},
};

const errorFunction = (msg, parentElem) => {
	const div = document.createElement("div");
	const text = document.createTextNode(msg);
	div.className = "text-danger text-center";
	div.appendChild(text);
	parentElem.insertBefore(div, parentElem.firstElementChild);
	setTimeout(() => {
		div.remove();
	}, 3000);
};

const loginForm = document.querySelector(".login-form");
const adminLoginForm = document.querySelector(".admin-login-form");

const login = async (e) => {
	e.preventDefault();
	const res = await fetch("/user/login", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			its: document.querySelector("#its").value,
			password: document.querySelector("#password").value,
		}),
	});
	const data = await res.json();
	// console.log(data);
	data.msg === "success"
		? (window.location.href = "/user/dashboard")
		: errorFunction(data.msg, loginForm);
};
const adminLogin = async (e) => {
	e.preventDefault();
	const res = await fetch("/admin/login", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			name: document.querySelector("#name").value,
			password: document.querySelector("#password").value,
		}),
	});
	const data = await res.json();
	// console.log(data);

	data.msg === "success"
		? (window.location.href = routes.admin.adminDashboard)
		: errorFunction(data.msg, adminLoginForm);
};

const feedbackForm = document.querySelector(".feedback");
const totalThali = document.querySelector(".total");
const fullThali = document.querySelector(".full");
const halfThali = document.querySelector(".half");
const notScanned = document.querySelector(".not-scanned");

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
			// qty: document.querySelector(`input[name="qty"]:checked`).value,
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

let dataTable; // Define a variable to hold the DataTable instance
const createTable = (data) => {
	document.querySelector(".thali-data").innerHTML = "";
	// Check if DataTable instance exists
	if (dataTable) {
		dataTable.destroy(); // Destroy the existing DataTable instance
	}

	if (data.length === 0) {
		document.querySelector(
			".thali-data"
		).innerHTML = `<p class="text-center text-danger my-3">No Data Available</p>`;
	} else {
		dataTable = $(".thali-data").DataTable({
			// Define column headers
			columns: [
				{ title: "Date" },
				{ title: "Thali Type" },
				{ title: "Name" },
				{ title: "Sabeel" },
				{ title: "Sector" },
				{ title: "Comments" },
			],
			// Add Buttons extension
			buttons: ["pdfHtml5"],
		});

		// Populate the DataTable with data
		data.forEach((currentItem) => {
			const row = dataTable.row
				.add([
					new Date(currentItem.markedAt)
						.toString()
						.split(" ")
						.splice(0, 4)
						.join(" "),
					currentItem.type,
					currentItem.name,
					currentItem.sabeel,
					currentItem.sector,
					currentItem.comment,
				])
				.draw(false)
				.node();

			$(document).on("change", "#thaliTypeFilter", function () {
				const selectedValue = $(this).val();
				if (selectedValue === "") {
					dataTable.columns(1).search("").draw(); // Clear filter and redraw the table
				} else {
					dataTable.columns(1).search(selectedValue).draw(); // Filter table based on selected value
				}
			});

			// Add a click event listener to toggle expand/collapse on name click
			$(row)
				.find("td:nth-child(3)")
				.on("click", function () {
					const tr = $(this).closest("tr");
					const row = dataTable.row(tr);

					if (row.child.isShown()) {
						// This row is already open - close it
						row.child.hide();
						tr.removeClass("shown");
					} else {
						// Open this row
						row.child(formatRowDetails(currentItem)).show();
						tr.addClass("shown");
					}
				});

			$(document).on("click", "#printData", function () {
				const filteredData = dataTable.rows().data().toArray(); // Get all data from the DataTable
				const selectedValue = $("#thaliTypeFilter").val(); // Get the selected value from the dropdown

				// Filter data based on the selected value
				const printableData =
					selectedValue === ""
						? filteredData
						: filteredData.filter((row) => row[1] === selectedValue);

				// Format the filtered data for printing (e.g., create a printable HTML string)
				let printableHtml = "";
				printableHtml += `<table class="table table-striped" border='1'><tr><th>Serial Number</th><th>Name</th><th>Sector</th></tr>`;
				printableData.forEach((row, index) => {
					printableHtml += `<tr><td>${index + 1}</td><td>${row[2]}</td><td>${
						row[4]
					}</td></tr>`;
				});
				printableHtml += "</table>";

				// Open a new window and print
				const printWindow = window.open("", "_blank");
				printWindow.document.write(printableHtml);
				printWindow.document.close();
				printWindow.print();
			});
		});
	}
};

// Function to format the details shown in the child row
function formatRowDetails(data) {
	return `<table class="table table-bordered">
                <tr><td><strong>Thali Number:</strong></td><td>${data.thaliNumber}</td></tr>
                <tr><td><strong>Thali Quantity:</strong></td><td>${data.thali}</td></tr>
                <tr><td><strong>Address:</strong></td><td>${data.address}</td></tr>
                <tr><td><strong>Mobile:</strong></td><td>+91-${data.mobile}</td></tr>
            </table>`;
}

// const fetchThali = async () => {
// 	document.querySelector(".thali-data").innerHTML = "";
// 	const res = await fetch(routes.admin.totalThali);
// 	const data = await res.json();
// 	document.querySelector(".thali-data").innerHTML = "";
// 	const resFull = await fetch(`${routes.admin.totalThali}/full`);
// 	const dataFull = await resFull.json();
// 	document.querySelector(".thali-data").innerHTML = "";
// 	const resHalf = await fetch(`${routes.admin.totalThali}/half`);
// 	const dataHalf = await resHalf.json();
// 	// console.log(data);
// 	createTable(data);
// 	document.querySelector(".total-thali").innerHTML = data.nbThali;
// 	document.querySelector(".full-thali").innerHTML = dataFull.nbThali;
// 	document.querySelector(".half-thali").innerHTML = dataHalf.nbThali;
// };

const dateAlterate = () => {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	const formattedDate = year + "-" + month + "-" + day;
	return formattedDate;
};

const thaliUsers = {
	presentees: [],
	all: 0,
};

const dateFilter = async () => {
	document.querySelector(".thali-data").innerHTML = "";
	let date = dateAlterate();
	if (document.querySelector("#date").value) {
		date = document.querySelector("#date").value;
	}
	// console.log(date);
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
	const allUsers = await fetch(routes.admin.totalThali);
	const allUsersData = await allUsers.json();
	thaliUsers.presentees = data.thali;
	thaliUsers.all = allUsersData.nbThali;
	if (data.err) {
		return (document.querySelector(
			".thali-data"
		).innerHTML = `<p class="text-center text-danger my-3">${data.msg}</p>`);
	}
	// console.log(data.thali);
	const full = data.thali.filter((user) => user.thali !== "half").length;
	const half = data.thali.filter((user) => user.thali !== "full").length;
	createTable(data.thali);
	document.querySelector(".total-thali").innerHTML = full + half;
	document.querySelector(".full-thali").innerHTML = full;
	document.querySelector(".half-thali").innerHTML = half;
	document.querySelector(".not-scanned-count").innerHTML =
		thaliUsers.all - thaliUsers.presentees.length;
};

const fetchFullThali = async () => {
	// document.querySelector(".thali-data").innerHTML = "";
	// const res = await fetch(`${routes.admin.totalThali}/full`);
	// const data = await res.json();
	// // console.log(data + "full thali");
	// createTable(data);
	// document.querySelector(".full-thali").innerHTML = data.nbThali;
	document.querySelector(".thali-data").innerHTML = "";
	let date = dateAlterate();
	if (document.querySelector("#date").value) {
		date = document.querySelector("#date").value;
	}
	// console.log(date);
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
	createTable(data.thali.filter((user) => user.thali !== "half"));
};

const fetchHalfThali = async () => {
	// document.querySelector(".thali-data").innerHTML = "";
	// const res = await fetch(`${routes.admin.totalThali}/half`);
	// const data = await res.json();
	// // console.log(data + "half thali");
	// createTable(data.thali);
	// document.querySelector(".half-thali").innerHTML = data.nbThali;
	document.querySelector(".thali-data").innerHTML = "";
	let date = dateAlterate();
	if (document.querySelector("#date").value) {
		date = document.querySelector("#date").value;
	}
	// console.log(date);
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
	createTable(data.thali.filter((user) => user.thali !== "full"));
};

const notScannedUsers = async () => {
	const res = await fetch(routes.admin.totalThali);
	const users = await res.json();
	thaliUsers.all = users.length;
	const absentees = [];
	// users.thali.forEach((user) => {
	// 	return !data.includes() && absentees.push(user);
	// });
	for (const user of users.thali) {
		let present = false;
		for (const presentUser of thaliUsers.presentees) {
			if (user.sabeel === presentUser.sabeel) {
				present = true;
				break;
			}
		}
		if (!present) {
			absentees.push({ ...user, markedAt: "Absent", comment: "Not Scanned" });
		}
	}
	createTable(absentees);
};

const page = () => {
	switch (window.location.pathname) {
		case "/":
			loginForm.addEventListener("submit", login);
			break;

		case "/admin/login":
			adminLoginForm.addEventListener("submit", adminLogin);
			break;

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
			// fetchThali();
			dateFilter();
			totalThali.addEventListener("click", dateFilter);
			fullThali.addEventListener("click", fetchFullThali);
			halfThali.addEventListener("click", fetchHalfThali);
			notScanned.addEventListener("click", notScannedUsers);
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
					// console.log(data.msg + " : this is data");
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
				// console.log(err);
			};

			scanner.render(success, error);
			// --- scanner

			break;

		default:
			break;
	}
};

document.addEventListener("DOMContentLoaded", page);
