const form = document.getElementById("riskRewardForm");

const entryInput = document.getElementById("entryPrice");
const stopInput = document.getElementById("stopPrice");
const targetInput = document.getElementById("targetPrice");
const sharesInput = document.getElementById("shares");
const formError = document.getElementById("formError");

const directionOutput = document.getElementById("tradeDirection");
const riskOutput = document.getElementById("riskPerShare");
const rewardOutput = document.getElementById("rewardPerShare");
const ratioOutput = document.getElementById("riskRewardRatio");
const lossOutput = document.getElementById("expectedLoss");
const profitOutput = document.getElementById("expectedProfit");
const statusOutput = document.getElementById("setupStatus");

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
}

function resetOutputs() {
    directionOutput.textContent = "—";
    riskOutput.textContent = "$0.00";
    rewardOutput.textContent = "$0.00";
    ratioOutput.textContent = "1 : 0.00";
    lossOutput.textContent = "—";
    profitOutput.textContent = "—";
    statusOutput.textContent = "—";

    statusOutput.classList.remove(
        "status-affordable",
        "status-insufficient",
        "status-warning"
    );
}

function showError(message) {
    resetOutputs();
    formError.textContent = message;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    formError.textContent = "";

    const entry = Number(entryInput.value);
    const stop = Number(stopInput.value);
    const target = Number(targetInput.value);
    const shares = sharesInput.value === ""
        ? null
        : Number(sharesInput.value);

    if (
        !Number.isFinite(entry) ||
        !Number.isFinite(stop) ||
        !Number.isFinite(target)
    ) {
        showError("Please enter valid entry, stop, and target prices.");
        return;
    }

    if (entry <= 0 || stop <= 0 || target <= 0) {
        showError("All prices must be greater than zero.");
        return;
    }

    if (entry === stop || entry === target) {
        showError("Entry must be different from both stop and target.");
        return;
    }

    const isLong = stop < entry && target > entry;
    const isShort = stop > entry && target < entry;

    if (!isLong && !isShort) {
        showError(
            "Invalid trade structure. For a long trade, stop must be below entry and target above entry. For a short trade, use the opposite."
        );
        return;
    }

    if (shares !== null && (!Number.isInteger(shares) || shares <= 0)) {
        showError("Position size must be a positive whole number.");
        return;
    }

    const riskPerShare = Math.abs(entry - stop);
    const rewardPerShare = Math.abs(target - entry);
    const ratio = rewardPerShare / riskPerShare;

    directionOutput.textContent = isLong ? "Long" : "Short";
    riskOutput.textContent = formatCurrency(riskPerShare);
    rewardOutput.textContent = formatCurrency(rewardPerShare);
    ratioOutput.textContent = `1 : ${ratio.toFixed(2)}`;

    if (shares !== null) {
        lossOutput.textContent = formatCurrency(riskPerShare * shares);
        profitOutput.textContent = formatCurrency(rewardPerShare * shares);
    }

    statusOutput.classList.remove(
        "status-affordable",
        "status-insufficient",
        "status-warning"
    );

    if (ratio >= 3) {
        statusOutput.textContent = "✅ Strong setup";
        statusOutput.classList.add("status-affordable");
    } else if (ratio >= 2) {
        statusOutput.textContent = "✅ Meets minimum rule";
        statusOutput.classList.add("status-affordable");
    } else if (ratio >= 1.5) {
        statusOutput.textContent = "⚠️ Below 1:2 minimum";
        statusOutput.classList.add("status-warning");
    } else {
        statusOutput.textContent = "❌ Poor risk/reward";
        statusOutput.classList.add("status-insufficient");
    }
});

form.addEventListener("reset", function () {
    window.setTimeout(function () {
        formError.textContent = "";
        resetOutputs();
    }, 0);
});

resetOutputs();