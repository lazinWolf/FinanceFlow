let incomeData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadIncomeData();
    document.querySelector("#addIncomeForm").addEventListener("submit", addIncome);
});

// Fetch income data from the server
async function loadIncomeData() {
    try {
        const response = await fetch("/api/income"); 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        incomeData = await response.json();
        renderIncomeTable(incomeData);
        updateIncomeSummary(incomeData);
    } catch (error) {
        console.error("Error fetching income data:", error);
    }
}

// Render the income table dynamically
function renderIncomeTable(data) {
    const tableBody = document.querySelector("#incomeTable tbody");
    tableBody.innerHTML = ""; 

    data.forEach(income => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${income.name}</td>
            <td>$${income.amount.toFixed(2)}</td>
            <td>${income.frequency}</td>
            <td>${new Date(income.lastReceived).toLocaleDateString()}</td>
            <td>
                <button class="edit-btn" onclick="editIncome('${income._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteIncome('${income._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update the income summary section
function updateIncomeSummary(data) {
    const totalMonthlyIncome = data
        .filter(income => income.frequency === "monthly")
        .reduce((sum, income) => sum + income.amount, 0);

    const totalYearlyIncome = data
        .filter(income => income.frequency === "yearly")
        .reduce((sum, income) => sum + income.amount, 0) + (totalMonthlyIncome * 12);

    const topIncomeSource = data.length
        ? data.reduce((top, income) => (income.amount > top.amount ? income : top)).name
        : "N/A";

    document.querySelector(".summary-card:nth-child(1) p").textContent = `$${totalMonthlyIncome.toFixed(2)}`;
    document.querySelector(".summary-card:nth-child(2) p").textContent = `$${totalYearlyIncome.toFixed(2)}`;
    document.querySelector(".summary-card:nth-child(3) p").textContent = topIncomeSource;
}

// Add a new income source
async function addIncome(event) {
    event.preventDefault();

    const name = document.querySelector("#incomeName").value;
    const amount = parseFloat(document.querySelector("#amount").value);
    const frequency = document.querySelector("#frequency").value;
    const startDate = document.querySelector("#startDate").value;

    if (amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    const newIncome = { name, amount, frequency, lastReceived: startDate };

    try {
        const response = await fetch("/api/income", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newIncome),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const addedIncome = await response.json();
        incomeData.push(addedIncome);
        renderIncomeTable(incomeData);
        updateIncomeSummary(incomeData);
        document.querySelector("#addIncomeForm").reset();
        alert("Income added successfully!");
    } catch (error) {
        console.error("Error adding income:", error);
    }
}

// Edit an existing income source
function editIncome(id) {
    const income = incomeData.find(income => income._id === id);
    if (!income) {
        alert("Income source not found.");
        return;
    }

    document.querySelector("#incomeName").value = income.name;
    document.querySelector("#amount").value = income.amount;
    document.querySelector("#frequency").value = income.frequency;
    document.querySelector("#startDate").value = new Date(income.lastReceived).toISOString().split('T')[0];

    const addIncomeBtn = document.querySelector(".add-btn");
    addIncomeBtn.textContent = "Update Income";
    addIncomeBtn.onclick = async (event) => {
        event.preventDefault();
        await updateIncome(id);
    };
}

// Update income source
async function updateIncome(id) {
    const name = document.querySelector("#incomeName").value;
    const amount = parseFloat(document.querySelector("#amount").value);
    const frequency = document.querySelector("#frequency").value;
    const startDate = document.querySelector("#startDate").value;

    const updatedIncome = { name, amount, frequency, lastReceived: startDate };

    try {
        const response = await fetch(`/api/income/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedIncome),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedData = await response.json();
        incomeData = incomeData.map(income =>
            income._id === id ? updatedData : income
        );
        renderIncomeTable(incomeData);
        updateIncomeSummary(incomeData);
        document.querySelector("#addIncomeForm").reset();

        const addIncomeBtn = document.querySelector(".add-btn");
        addIncomeBtn.textContent = "Add Income";
        addIncomeBtn.onclick = addIncome; 
        alert("Income updated successfully!");
    } catch (error) {
        console.error("Error updating income:", error);
    }
}

// Delete income source
async function deleteIncome(id) {
    if (!confirm("Are you sure you want to delete this income source?")) return;

    try {
        const response = await fetch(`/api/income/${id}`, { 
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        incomeData = incomeData.filter(income => income._id !== id);
        renderIncomeTable(incomeData);
        updateIncomeSummary(incomeData);
        alert("Income deleted successfully!");
    } catch (error) {
        console.error("Error deleting income:", error);
    }
}