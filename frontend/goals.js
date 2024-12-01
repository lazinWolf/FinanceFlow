let goalsData = [];

document.addEventListener("DOMContentLoaded", function () {
    loadGoals();
    document.querySelector("#addGoalForm").addEventListener("submit", addGoal);
    document.querySelector("#goalSearch").addEventListener("input", searchGoals);
    document.querySelector("#goalStatusFilter").addEventListener("change", filterGoals);
    document.querySelector("#sortOptions").addEventListener("change", handleSort);
    document.querySelector("#goalsTable").addEventListener("click", handleTableClick);
});

async function loadGoals() {
    try {
        const response = await fetch("http://localhost:5000/api/goals");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        goalsData = await response.json();
        renderTable(goalsData);
        updateOverview(goalsData);
    } catch (error) {
        console.error("Error loading goals:", error);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#goalsTable tbody");
    tableBody.innerHTML = "";

    data.forEach(goal => {
        const progress = (goal.currentSavings / goal.targetAmount) * 100;
        const row = document.createElement("tr");
        row.dataset.goalId = goal._id;

        row.innerHTML = `
            <td>${goal.goalName}</td>
            <td>₹${goal.targetAmount}</td>
            <td>₹${goal.currentSavings}</td>
            <td>${new Date(goal.targetDate).toLocaleDateString()}</td>
            <td>
                <div class="progress-bar-container" aria-label="${progress.toFixed(2)}% progress toward goal">
                    <div class="progress-bar" style="width: ${progress.toFixed(2)}%;"></div>
                </div>
            </td>
            <td><span class="status ${goal.currentSavings >= goal.targetAmount ? 'completed' : 'active'}">${goal.currentSavings >= goal.targetAmount ? 'Completed' : 'Active'}</span></td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateOverview(data) {
    const totalGoals = data.length;
    const completedGoals = data.filter(goal => goal.currentSavings >= goal.targetAmount).length;
    const activeGoals = totalGoals - completedGoals;

    document.querySelector("#totalGoals").textContent = totalGoals;
    document.querySelector("#completedGoals").textContent = completedGoals;
    document.querySelector("#activeGoals").textContent = activeGoals;
}

async function addGoal(event) {
    event.preventDefault();

    if (formValidation()) {
        const goalName = document.querySelector("#goalName").value;
        const targetAmount = parseFloat(document.querySelector("#targetAmount").value);
        const currentSavings = parseFloat(document.querySelector("#currentSavings").value);
        const targetDate = new Date(document.querySelector("#targetDate").value).toISOString();  // Ensuring correct format

        const newGoal = { goalName, targetAmount, currentSavings, targetDate };

        // If we are editing a goal (editing mode is active)
        if (document.querySelector("#addGoalForm").dataset.editingGoalId) {
            const goalId = document.querySelector("#addGoalForm").dataset.editingGoalId;

            try {
                const response = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newGoal),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedData = await response.json();
                goalsData = goalsData.map(goal => (goal._id === goalId ? updatedData : goal));
                renderTable(goalsData);
                updateOverview(goalsData);

                document.querySelector("#addGoalForm").reset();
                document.querySelector(".add-goal-section h2").textContent = "Add New Goal";
                delete document.querySelector("#addGoalForm").dataset.editingGoalId;  // Reset editing state

                alert("Goal updated successfully!");
            } catch (error) {
                console.error("Error updating goal:", error);
            }
        } else {
            try {
                const response = await fetch("http://localhost:5000/api/goals", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newGoal),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const addedGoal = await response.json();
                goalsData.push(addedGoal);
                renderTable(goalsData);
                updateOverview(goalsData);

                document.querySelector("#addGoalForm").reset();
                alert("Goal added successfully!");
            } catch (error) {
                console.error("Error adding goal:", error);
            }
        }
    }
}

async function editGoal(goalId) {
    const goal = goalsData.find(goal => goal._id === goalId);
    if (!goal) {
        alert("Goal not found.");
        return;
    }

    document.querySelector("#goalName").value = goal.goalName;
    document.querySelector("#targetAmount").value = goal.targetAmount;
    document.querySelector("#currentSavings").value = goal.currentSavings;
    document.querySelector("#targetDate").value = new Date(goal.targetDate).toISOString().split('T')[0];  // Convert date to input format

    document.querySelector(".add-goal-section h2").textContent = "Edit Goal";
    document.querySelector("#addGoalForm").dataset.editingGoalId = goal._id;  // Mark the form as "editing"

    window.scrollTo(0, 0);  // Scroll to the form when editing
}

async function deleteGoal(goalId) {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        goalsData = goalsData.filter(goal => goal._id !== goalId);
        renderTable(goalsData);
        updateOverview(goalsData);
        alert("Goal deleted successfully!");
    } catch (error) {
        console.error("Error deleting goal:", error);
    }
}

function searchGoals() {
    const searchValue = document.querySelector("#goalSearch").value.toLowerCase();
    const filteredData = goalsData.filter(goal =>
        goal.goalName.toLowerCase().includes(searchValue)
    );
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

function handleTableClick(event) {
    const clickedElement = event.target;
    const goalId = clickedElement.closest("tr").dataset.goalId;

    if (clickedElement.classList.contains("edit-btn")) {
        editGoal(goalId);
    }

    if (clickedElement.classList.contains("delete-btn")) {
        deleteGoal(goalId);
    }
}

function formValidation() {
    const goalName = document.querySelector("#goalName").value;
    const targetAmount = parseFloat(document.querySelector("#targetAmount").value);
    const currentSavings = parseFloat(document.querySelector("#currentSavings").value);
    const targetDate = document.querySelector("#targetDate").value;

    if (!goalName || targetAmount <= 0 || currentSavings < 0 || !targetDate) {
        alert("Please fill all the fields correctly.");
        return false;
    }
    return true;
}
