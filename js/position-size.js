const form = document.getElementById("positionSizeForm");

const accountSizeInput = document.getElementById("accountSize");
const riskPercentInput = document.getElementById("riskPercent");
const entryPriceInput = document.getElementById("entryPrice");
const stopPriceInput = document.getElementById("stopPrice");

const formError = document.getElementById("formError");

const riskAmountOutput = document.getElementById("riskAmount");
const riskPerShareOutput = document.getElementById("riskPerShare");
const recommendedSharesOutput =
    document.getElementById("recommendedShares");
const buyingPowerNeededOutput =
    document.getElementById("buyingPowerNeeded");
const availableCashOutput =
    document.getElementById("availableCash");
const affordableSharesOutput =
    document.getElementById("affordableShares");
const actualSharesOutput =
    document.getElementById("actualShares");
const positionValueOutput =
    document.getElementById("positionValue");
const actualRiskOutput =
    document.getElementById("actualRisk");
const buyingPowerStatusOutput =
    document.getElementById("buyingPowerStatus");

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
}

function formatShares(value) {
    return `${value.toLocaleString()} ${value === 1 ? "share" : "shares"}`;
}

function resetOutputs() {
    riskAmountOutput.textContent = "$0.00";
    riskPerShareOutput.textContent = "$0.00";
    recommendedSharesOutput.textContent = "0 shares";
    buyingPowerNeededOutput.textContent = "$0.00";
    availableCashOutput.textContent = "$0.00";
    affordableSharesOutput.textContent = "0 shares";
    actualSharesOutput.textContent = "0 shares";
    positionValueOutput.textContent = "$0.00";
    actualRiskOutput.textContent = "$0.00";
    buyingPowerStatusOutput.textContent = "—";

    buyingPowerStatusOutput.classList.remove(
        "status-affordable",
        "status-insufficient"
    );
}

function showError(message) {
    resetOutputs();
    formError.textContent = message;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    formError.textContent = "";

    const accountSize = Number(accountSizeInput.value);
    const riskPercent = Number(riskPercentInput.value);
    const entryPrice = Number(entryPriceInput.value);
    const stopPrice = Number(stopPriceInput.value);

    if (
        !Number.isFinite(accountSize) ||
        !Number.isFinite(riskPercent) ||
        !Number.isFinite(entryPrice) ||
        !Number.isFinite(stopPrice)
    ) {
        showError("Please enter valid numeric values.");
        return;
    }

    if (
        accountSize <= 0 ||
        riskPercent <= 0 ||
        entryPrice <= 0 ||
        stopPrice <= 0
    ) {
        showError("All values must be greater than zero.");
        return;
    }

    if (riskPercent > 100) {
        showError("Risk percentage cannot exceed 100%.");
        return;
    }

    if (entryPrice === stopPrice) {
        showError(
            "Entry price and stop-loss price cannot be the same."
        );
        return;
    }

    const maximumRisk =
        accountSize * (riskPercent / 100);

    const riskPerShare =
        Math.abs(entryPrice - stopPrice);

    const recommendedShares =
        Math.floor(maximumRisk / riskPerShare);

    const maximumAffordableShares =
        Math.floor(accountSize / entryPrice);

    if (recommendedShares < 1) {
        showError(
            "Your selected risk is too small for at least one share."
        );
        return;
    }

    if (maximumAffordableShares < 1) {
        showError(
            "Your available cash is not enough to purchase one share."
        );
        return;
    }

    const buyingPowerNeeded =
        recommendedShares * entryPrice;

    const actualShares =
        Math.min(
            recommendedShares,
            maximumAffordableShares
        );

    const actualPositionValue =
        actualShares * entryPrice;

    const actualRisk =
        actualShares * riskPerShare;

    const isAffordable =
        recommendedShares <= maximumAffordableShares;

    riskAmountOutput.textContent =
        formatCurrency(maximumRisk);

    riskPerShareOutput.textContent =
        formatCurrency(riskPerShare);

    recommendedSharesOutput.textContent =
        formatShares(recommendedShares);

    buyingPowerNeededOutput.textContent =
        formatCurrency(buyingPowerNeeded);

    availableCashOutput.textContent =
        formatCurrency(accountSize);

    affordableSharesOutput.textContent =
        formatShares(maximumAffordableShares);

    actualSharesOutput.textContent =
        formatShares(actualShares);

    positionValueOutput.textContent =
        formatCurrency(actualPositionValue);

    actualRiskOutput.textContent =
        formatCurrency(actualRisk);

    buyingPowerStatusOutput.classList.remove(
        "status-affordable",
        "status-insufficient"
    );

    if (isAffordable) {
        buyingPowerStatusOutput.textContent =
            "✅ Position is affordable";

        buyingPowerStatusOutput.classList.add(
            "status-affordable"
        );
    } else {
        buyingPowerStatusOutput.textContent =
            "❌ Insufficient buying power";

        buyingPowerStatusOutput.classList.add(
            "status-insufficient"
        );
    }
});

form.addEventListener("reset", function () {
    window.setTimeout(function () {
        formError.textContent = "";
        resetOutputs();
    }, 0);
});

resetOutputs();