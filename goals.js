let goalsData = JSON.parse(localStorage.getItem("goalsData")) || [];

document.addEventListener("DOMContentLoaded", function () {
    loadGoals();
    document.querySelector("#addGoalForm").addEventListener("submit", addGoal);
    document.querySelector("#goalSearch").addEventListener("input", searchGoals);
    document.querySelector("#goalStatusFilter").addEventListener("change", filterGoals);
    document.querySelector("#sortOptions").addEventListener("change", handleSort);
    document.querySelector("#goalsTable").addEventListener("click", handleTableClick);
});

function loadGoals() {
    if (goalsData.length === 0) {
        fetch("goals.json")
            .then(response => response.json())
            .then(data => {
                goalsData = data;
                localStorage.setItem("goalsData", JSON.stringify(goalsData));
                renderTable(goalsData);
                updateOverview(goalsData);
            })
            .catch(error => console.error("Error loading goals:", error));
    } else {
        renderTable(goalsData);
        updateOverview(goalsData);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#goalsTable tbody");
    tableBody.innerHTML = "";

    data.forEach(goal => {
        const progress = (goal.currentSavings / goal.targetAmount) * 100;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${goal.goalName}</td>
            <td>₹${goal.targetAmount}</td>
            <td>₹${goal.currentSavings}</td>
            <td>${goal.targetDate}</td>
            <td>
                <div class="progress-bar-container" aria-label="${progress.toFixed(2)}% progress toward goal">
                    <div class="progress-bar" style="width: ${progress.toFixed(2)}%;"></div>
                </div>
            </td>
            <td><span class="status ${goal.currentSavings >= goal.targetAmount ? 'completed' : 'active'}">${goal.currentSavings >= goal.targetAmount ? 'Completed' : 'Active'}</span></td>
            <td><button class="edit-btn">Edit</button> <button class="delete-btn" onclick="deleteGoal('${goal.goalName}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function addGoal(event) {
    event.preventDefault();

    if (formValidation()) {
        const goalName = document.querySelector("#goalName").value;
        const targetAmount = parseFloat(document.querySelector("#targetAmount").value);
        const currentSavings = parseFloat(document.querySelector("#currentSavings").value);
        const targetDate = document.querySelector("#targetDate").value;

        const newGoal = { goalName, targetAmount, currentSavings, targetDate };
        goalsData.push(newGoal);
        localStorage.setItem("goalsData", JSON.stringify(goalsData));
        renderTable(goalsData);
        updateOverview(goalsData);

        document.querySelector("#addGoalForm").reset();
        alert("Goal added successfully!");
    }
}

function deleteGoal(goalName) {
    if (confirm("Are you sure you want to delete this goal?")) {
        goalsData = goalsData.filter(goal => goal.goalName !== goalName);
        localStorage.setItem("goalsData", JSON.stringify(goalsData));
        renderTable(goalsData);
        updateOverview(goalsData);
    }
}

function handleTableClick(event) {
    if (event.target.classList.contains("edit-btn")) {
        const row = event.target.closest("tr");
        editGoal(row);
    }
}

function editGoal(row) {
    const goalName = row.cells[0].textContent;
    const goal = goalsData.find(g => g.goalName === goalName);

    document.querySelector("#goalName").value = goal.goalName;
    document.querySelector("#targetAmount").value = goal.targetAmount;
    document.querySelector("#currentSavings").value = goal.currentSavings;
    document.querySelector("#targetDate").value = goal.targetDate;

    // Change form heading to "Edit Goal"
    document.querySelector(".add-goal-section h2").textContent = "Edit Goal";

    // Scroll to the form
    document.querySelector(".add-goal-section").scrollIntoView({ behavior: 'smooth' });

    document.querySelector("#addGoalForm").removeEventListener("submit", addGoal);
    document.querySelector("#addGoalForm").addEventListener("submit", function updateGoal(event) {
        event.preventDefault();
        saveUpdatedGoal(goal);
        renderTable(goalsData);
        updateOverview(goalsData);
        this.reset();
        document.querySelector(".add-goal-section h2").textContent = "Add New Goal"; // Reset heading after update
        document.querySelector("#addGoalForm").removeEventListener("submit", updateGoal);
        document.querySelector("#addGoalForm").addEventListener("submit", addGoal);
    });
}

function saveUpdatedGoal(goal) {
    goal.goalName = document.querySelector("#goalName").value;
    goal.targetAmount = parseFloat(document.querySelector("#targetAmount").value);
    goal.currentSavings = parseFloat(document.querySelector("#currentSavings").value);
    goal.targetDate = document.querySelector("#targetDate").value;
    localStorage.setItem("goalsData", JSON.stringify(goalsData));
}

function handleSort() {
    const sortValue = document.querySelector("#sortOptions").value;
    let sortedData;

    switch (sortValue) {
        case "dateAsc":
            sortedData = goalsData.slice().sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
            break;
        case "dateDesc":
            sortedData = goalsData.slice().sort((a, b) => new Date(b.targetDate) - new Date(a.targetDate));
            break;
        case "categoryAsc":
            sortedData = goalsData.slice().sort((a, b) => a.goalName.localeCompare(b.goalName));
            break;
        case "categoryDesc":
            sortedData = goalsData.slice().sort((a, b) => b.goalName.localeCompare(a.goalName));
            break;
        case "amountAsc":
            sortedData = goalsData.slice().sort((a, b) => a.targetAmount - b.targetAmount);
            break;
        case "amountDesc":
            sortedData = goalsData.slice().sort((a, b) => b.targetAmount - a.targetAmount);
            break;
        default:
            sortedData = goalsData;
    }
    renderTable(sortedData);
}

function searchGoals() {
    const searchValue = document.querySelector("#goalSearch").value.toLowerCase();
    const filteredData = goalsData.filter(goal => goal.goalName.toLowerCase().includes(searchValue));
    renderTable(filteredData);
}

function filterGoals() {
    const filterValue = document.querySelector("#goalStatusFilter").value;
    const filteredData = goalsData.filter(goal => 
        filterValue === "all" ||
        (filterValue === "active" && goal.currentSavings < goal.targetAmount) ||
        (filterValue === "completed" && goal.currentSavings >= goal.targetAmount)
    );
    renderTable(filteredData);
}

function updateOverview(data) {
    const totalGoals = data.length;
    const completedGoals = data.filter(goal => goal.currentSavings >= goal.targetAmount).length;
    const activeGoals = totalGoals - completedGoals;

    document.querySelector(".goals-summary-cards .summary-card:nth-child(1) p").textContent = totalGoals;
    document.querySelector(".goals-summary-cards .summary-card:nth-child(2) p").textContent = completedGoals;
    document.querySelector(".goals-summary-cards .summary-card:nth-child(3) p").textContent = activeGoals;
}

function formValidation() {
    const targetAmount = parseFloat(document.querySelector("#targetAmount").value);
    const currentSavings = parseFloat(document.querySelector("#currentSavings").value);
    const targetDate = new Date(document.querySelector("#targetDate").value);
    const currentDate = new Date();

    if (targetAmount <= 0 || currentSavings < 0) {
        alert("Target amount and current savings must be greater than 0.");
        return false;
    }

    if (targetDate <= currentDate) {
        alert("Date must be greater than Current Date.");
        return false;
    }

    return true;
}
