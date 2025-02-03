const baseUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const dropdowns = document.querySelectorAll(".dropdown select");


if (typeof countryList !== "undefined") {
    for (let select of dropdowns) {
        for (let currencyCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currencyCode;
            newOption.value = currencyCode;
            select.append(newOption);
            if (select.name === "from" && currencyCode === "USD")
                newOption.selected = "selected";
            else if (select.name === "to" && currencyCode === "INR")
                newOption.selected = "selected";
        }
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const url = `${baseUrl}/${fromCurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate");
        }
        let data = await response.json();
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate";
        console.error(error);
    }
};

const updateFlag = (elem) => {
    let currencyCode = elem.value;
    let countryCode = countryList[currencyCode];
    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let image = elem.parentElement.querySelector("img");
        if (image) image.src = newSrc;
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
