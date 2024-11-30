let expensesData = JSON.parse(localStorage.getItem("expensesData")) || [];

document.addEventListener("DOMContentLoaded", function () {
    loadExpenses();
    document.querySelector("#addExpenseForm").addEventListener("submit", addExpense);
    document.querySelector("#sortOptions").addEventListener("change", handleSort);
    document.querySelector("#applyFilters").addEventListener("click", applyFilters);
    document.querySelector("#resetFilters").addEventListener("click", resetFilters);
});

function loadExpenses() {
    if (expensesData.length === 0) {
        fetch("expenses.json")
            .then(response => response.json())
            .then(data => {
                expensesData = data;
                localStorage.setItem("expensesData", JSON.stringify(expensesData));
                renderTable(expensesData);
            })
            .catch(error => console.error("Error loading expenses:", error));
    } else {
        renderTable(expensesData);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#expensesTable tbody");
    tableBody.innerHTML = "";

    data.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.description}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", () => deleteExpense(expense));
        tableBody.appendChild(row);
    });

    updateSummary(data);
}

function addExpense(event) {
    event.preventDefault();

    const date = document.querySelector("#expenseDate").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = parseFloat(document.querySelector("#expenseAmount").value);
    const description = document.querySelector("#expenseDescription").value;

    // Validate amount
    if (amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    // Validate date
    const currentDate = new Date().toISOString().split('T')[0];
    if (date <= currentDate) {
        alert("Date must be greater than the current date.");
        return;
    }

    const newExpense = { date, category, amount, description };
    expensesData.push(newExpense);
    localStorage.setItem("expensesData", JSON.stringify(expensesData));
    renderTable(expensesData);

    document.querySelector("#addExpenseForm").reset();
    showSuccessMessage();
}

function deleteExpense(expenseToDelete) {
    if (confirm("Are you sure you want to delete this expense?")) {
        expensesData = expensesData.filter(expense => expense !== expenseToDelete);
        localStorage.setItem("expensesData", JSON.stringify(expensesData));
        renderTable(expensesData);
    }
}

function showSuccessMessage() {
    alert("Expense added successfully!");
}

function handleSort() {
    const sortValue = document.querySelector("#sortOptions").value;
    let sortedData;

    switch (sortValue) {
        case "dateAsc":
            sortedData = expensesData.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "dateDesc":
            sortedData = expensesData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "categoryAsc":
            sortedData = expensesData.slice().sort((a, b) => a.category.localeCompare(b.category));
            break;
        case "categoryDesc":
            sortedData = expensesData.slice().sort((a, b) => b.category.localeCompare(a.category));
            break;
        case "amountAsc":
            sortedData = expensesData.slice().sort((a, b) => a.amount - b.amount);
            break;
        case "amountDesc":
            sortedData = expensesData.slice().sort((a, b) => b.amount - a.amount);
            break;
        default:
            sortedData = expensesData;
    }
    renderTable(sortedData);
}

function applyFilters() {
    const category = document.querySelector("#filterCategory").value;
    const startDate = new Date(document.querySelector("#filterStartDate").value);
    const endDate = new Date(document.querySelector("#filterEndDate").value);

    const filteredData = expensesData.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (category === "All" || expense.category === category) &&
               (!document.querySelector("#filterStartDate").value || expenseDate >= startDate) &&
               (!document.querySelector("#filterEndDate").value || expenseDate <= endDate);
    });

    renderTable(filteredData);
}

function resetFilters() {
    document.querySelector("#filterCategory").value = "All";
    document.querySelector("#filterStartDate").value = "";
    document.querySelector("#filterEndDate").value = "";
    renderTable(expensesData);
}

function updateSummary(data) {
    const totalExpenses = data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const highestExpense = data.length ? Math.max(...data.map(expense => parseFloat(expense.amount))) : 0;
    const averageExpense = data.length ? (totalExpenses / data.length) : 0;

    document.querySelector("#totalExpenses").textContent = `₹${totalExpenses.toFixed(2)}`;
    document.querySelector("#highestExpense").textContent = `₹${highestExpense.toFixed(2)}`;
    document.querySelector("#averageExpense").textContent = `₹${averageExpense.toFixed(2)}`;
}
