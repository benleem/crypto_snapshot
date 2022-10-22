const input = document.querySelector(".input_text");
const legendTitle = document.querySelector(".mobile");
const legendWrapper = document.querySelector(".legend_wrapper");
const btn = document.querySelector(".scroll_top");
const dataError = document.querySelector(".data_error");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");

var stockCompanies = [];

input.addEventListener("keyup", (e) => {
	const searchString = e.target.value.toLowerCase();
	const filteredCompanies = stockCompanies.filter((company) => {
		return (
			company.name.toLowerCase().includes(searchString) ||
			company.symbol.toLowerCase().includes(searchString)
		);
	});
	displayCompanies(filteredCompanies);
});

legendTitle.addEventListener("click", () => {
	document.querySelector(".legend").classList.toggle("active");
});

const loadCompanies = async () => {
	try {
		error.classList.toggle("active");
		loading.classList.toggle("active");
		const res = await fetch(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h%2C7d`
		);
		stockCompanies = await res.json();
		loading.classList.toggle("active");
		displayCompanies(stockCompanies);
	} catch (err) {
		console.error(err);
		loading.classList.toggle("active");
		dataError.classList.toggle("active");
	}
};

const displayCompanies = (data) => {
	var dynamic = [];
	for (var i = 0; i < data.length; i++) {
		dynamic.push(`
        <div class="result_row">
            <div class='coin'>
                <img src="${data[i].image}" alt="">
                <h2>${data[i].name}</h2>
                <p class='ticker' style='padding:0;'>${data[i].symbol}</p>
            </div>
            <div class='details'>
                <p class='price'>$${data[i].current_price}</p>
                <p class='change_24h'>${
									Math.round(
										data[i].price_change_percentage_24h_in_currency * 100
									) / 100
								}</p>
                <p class='change_7d'>${
									Math.round(
										data[i].price_change_percentage_7d_in_currency * 100
									) / 100
								}</p>
                <p class='volume'>$${data[i].total_volume.toLocaleString(
									"en-US"
								)}</p>
                <p class='cap' style='padding:0;'>$${data[
									i
								].market_cap.toLocaleString("en-US")}</p>
            </div>
        </div>`);
	}
	document.querySelector(".listings").innerHTML = dynamic.join("");
	addClass();

	if (data.length == 0) {
		error.style.display = "flex";
		legendWrapper.style.display = "none";
	} else {
		error.style.display = "none";
		legendWrapper.style.display = "flex";
	}
};

const addClass = () => {
	const changeDay = document.querySelectorAll(".change_24h");
	const changeWeek = document.querySelectorAll(".change_7d");

	for (var i = 0; i < changeDay.length; i++) {
		if (changeDay[i].innerHTML < 0) {
			changeDay[i].classList.add("red");
		} else {
			changeDay[i].classList.add("green");
		}
	}
	for (var i = 0; i < changeWeek.length; i++) {
		if (changeWeek[i].innerHTML < 0) {
			changeWeek[i].classList.add("red");
		} else {
			changeWeek[i].classList.add("green");
		}
	}
};

loadCompanies();

const scrollToTop = () => {
	var rootElement = document.documentElement;
	rootElement.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};
btn.addEventListener("click", scrollToTop);
