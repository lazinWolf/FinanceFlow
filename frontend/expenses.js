let expensesData = [];

document.addEventListener("DOMContentLoaded", function () {
    loadExpenses();
    document.querySelector("#addExpenseForm").addEventListener("submit", addExpense);
    document.querySelector("#sortOptions").addEventListener("change", handleSort);
    document.querySelector("#applyFilters").addEventListener("click", applyFilters);
    document.querySelector("#resetFilters").addEventListener("click", resetFilters);
});

async function loadExpenses() {
    try {
        const response = await fetch("http://localhost:5000/api/expenses");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        expensesData = await response.json();
        renderTable(expensesData);
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#expensesTable tbody");
    tableBody.innerHTML = "";

    data.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.description}</td>
            <td>
                <button class="edit-btn" onclick="editExpense('${expense._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteExpense('${expense._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateSummary(data);
}

async function addExpense(event) {
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

    const newExpense = { date, category, amount, description };

    try {
        const response = await fetch("http://localhost:5000/api/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newExpense),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const addedExpense = await response.json();
        expensesData.push(addedExpense);
        renderTable(expensesData);
        document.querySelector("#addExpenseForm").reset();
        alert("Expense added successfully!");
    } catch (error) {
        console.error("Error adding expense:", error);
    }
}

async function editExpense(id) {
    const expense = expensesData.find(expense => expense._id === id);
    if (!expense) {
        alert("Expense not found.");
        return;
    }

    // Populate the form with the expense data
    document.querySelector("#expenseDate").value = new Date(expense.date).toISOString().split('T')[0];
    document.querySelector("#expenseCategory").value = expense.category;
    document.querySelector("#expenseAmount").value = expense.amount;
    document.querySelector("#expenseDescription").value = expense.description;

    // Change the "Add Expense" button to "Update Expense"
    const addExpenseBtn = document.querySelector(".add-btn");
    addExpenseBtn.textContent = "Update Expense";
    addExpenseBtn.onclick = async (event) => {
        event.preventDefault();
        await updateExpense(id);
    };
}

async function updateExpense(id) {
    const date = document.querySelector("#expenseDate").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = parseFloat(document.querySelector("#expenseAmount").value);
    const description = document.querySelector("#expenseDescription").value;

    // Validate amount
    if (amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    const updatedExpense = { date, category, amount, description };

    try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedExpense),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedData = await response.json();
        expensesData = expensesData.map(expense =>
            expense._id === id ? updatedData : expense
        );
        renderTable(expensesData);
        document.querySelector("#addExpenseForm").reset();
        alert("Expense updated successfully!");

        // Change the button back to "Add Expense"
        const addExpenseBtn = document.querySelector(".add-btn");
        addExpenseBtn.textContent = "Add Expense";
        addExpenseBtn.onclick = addExpense; // Reset the onclick handler
    } catch (error) {
        console.error("Error updating expense:", error);
    }
}

async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        expensesData = expensesData.filter(expense => expense._id !== id);
        renderTable(expensesData);
        alert("Expense deleted successfully!");
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
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