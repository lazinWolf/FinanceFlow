document.addEventListener("DOMContentLoaded", function () {
    loadBills();  // Load bills when the page loads
    document.querySelector("#addBillForm").addEventListener("submit", addBill);  // Add bill on form submit
    document.querySelector("#sortOptions").addEventListener("change", handleSort);  // Sort bills on sort option change
});

let billsData = [];  // Store the list of bills fetched from the API

// Load bills from the API
async function loadBills() {
    try {
        const response = await fetch("http://localhost:5000/api/bills");  // Fetch bills from the API
        if (!response.ok) {
            throw new Error('Failed to load bills');
        }
        billsData = await response.json();  // Parse the JSON response
        renderTable(billsData);  // Render the table with fetched bills
        updateOverview(billsData);  // Update the bills overview
    } catch (error) {
        alert("Error loading bills: " + error.message);
    }
}

// Render the table with bills data
function renderTable(data) {
    const tableBody = document.querySelector("#billsTable tbody");
    tableBody.innerHTML = "";  // Clear the table body before re-rendering

    data.forEach(bill => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${bill.name}</td>
            <td>${bill.amount.toFixed(2)}</td>
            <td>${bill.frequency}</td>
            <td>${new Date(bill.nextDue).toLocaleDateString()}</td>
            <td><span class="status ${bill.status.toLowerCase()}">${bill.status}</span></td>
            <td>
                <button class="edit-btn" onclick="editBill('${escapeSpecialChars(bill._id)}')">Edit</button>
                <button class="delete-btn" onclick="deleteBill('${escapeSpecialChars(bill._id)}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function escapeSpecialChars(str) {
    return str.replace(/'/g, "\\'"); // Escapes single quotes
}

// Add a new bill
async function addBill(event) {
    event.preventDefault();  // Prevent form submission from reloading the page

    const name = document.querySelector("#billName").value;
    const amount = parseFloat(document.querySelector("#amount").value);
    const frequency = document.querySelector("#frequency").value;
    const nextDue = document.querySelector("#nextDate").value;

    // Validate the amount
    if (amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    const newBill = { name, amount, frequency, nextDue, status: "Pending" };

    try {
        const response = await fetch('/api/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBill),
        });

        if (!response.ok) {
            throw new Error('Failed to add bill');
        }

        const bill = await response.json();  // Get the new bill from the API
        billsData.push(bill);  // Add the new bill to the local bills data
        renderTable(billsData);  // Re-render the table with the updated bills
        updateOverview(billsData);  // Update the bills overview
        document.querySelector("#addBillForm").reset();  // Reset the form
        alert("Bill added successfully!");  // Show success message
    } catch (error) {
        alert("Error adding bill: " + error.message);
    }
}

// Edit a bill
async function editBill(id) {
    const bill = billsData.find(b => b._id === id);
    if (!bill) {
        alert("Bill not found.");
        return;
    }

    // Populate the form with the bill data
    document.querySelector("#billName").value = bill.name;
    document.querySelector("#amount").value = bill.amount;
    document.querySelector("#frequency").value = bill.frequency;
    document.querySelector("#nextDate").value = new Date(bill.nextDue).toISOString().split('T')[0];

    // Change the button to update the bill
    const addBillBtn = document.querySelector(".add-btn");
    addBillBtn.textContent = "Update Bill";  // Change button text
    addBillBtn.onclick = async (event) => {
        event.preventDefault();
        await updateBill(id);  // Update the bill on submit
    };
}

// Update a bill
async function updateBill(id) {
    const bill = billsData.find(b => b._id === id);
    if (!bill) {
        alert("Bill not found.");
        return;
    }

    // Update the bill information from the form
    bill.name = document.querySelector("#billName").value;
    bill.amount = parseFloat(document.querySelector("#amount").value);
    bill.frequency = document.querySelector("#frequency").value;
    bill.nextDue = document.querySelector("#nextDate").value;

    try {
        const response = await fetch(`/api/bills/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bill),  // Send the updated bill data
        });

        if (!response.ok) {
            throw new Error('Failed to update bill');
        }

        const updatedBill = await response.json();  // Get the updated bill from the API
        const index = billsData.findIndex(b => b._id === id);
        billsData[index] = updatedBill;  // Update the local bill data
        renderTable(billsData);  // Re-render the table with updated data
        updateOverview(billsData);  // Update the bills overview
        document.querySelector("#addBillForm").reset();  // Reset the form
        alert("Bill updated successfully!");  // Show success message

        // Reset button text back to "Add Bill"
        const addBillBtn = document.querySelector(".add-btn");
        addBillBtn.textContent = "Add Bill";
        addBillBtn.onclick = addBill;
    } catch (error) {
        alert("Error updating bill: " + error.message);
    }
}

// Delete a bill
async function deleteBill(id) {
    if (!confirm("Are you sure you want to delete this bill?")) return;

    try {
        const response = await fetch(`/api/bills/${id}`, {
            method: 'DELETE',  // Send a DELETE request to the API
        });

        if (!response.ok) {
            throw new Error('Failed to delete bill');
        }

        billsData = billsData.filter(bill => bill._id !== id);  // Remove the bill from local data
        renderTable(billsData);  // Re-render the table with updated bills
        updateOverview(billsData);  // Update the bills overview
        alert("Bill deleted successfully!");  // Show success message
    } catch (error) {
        alert("Error deleting bill: " + error.message);
    }
}

// Handle sorting of bills by date or amount
function handleSort() {
    const sortOption = document.querySelector("#sortOptions").value;
    let sortedBills;

    if (sortOption === "date") {
        sortedBills = [...billsData].sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue));  // Sort by next due date
    } else if (sortOption === "amount") {
        sortedBills = [...billsData].sort((a, b) => a.amount - b.amount);  // Sort by amount
    }

    renderTable(sortedBills);  // Re-render the table with sorted bills
}

// Update the bills overview (Total bills, Upcoming bills, Paid this month)
function updateOverview(bills) {
    const totalBills = bills.length;
    const upcomingBills = bills.filter(bill => new Date(bill.nextDue) > new Date()).length;
    const paidThisMonth = bills.filter(bill => bill.status === "Paid").reduce((acc, bill) => acc + bill.amount, 0);

    document.querySelector("#totalBills").textContent = totalBills;  // Update total bills count
    document.querySelector("#upcomingBills").textContent = upcomingBills;  // Update upcoming bills count
    document.querySelector("#paidThisMonth").textContent = `$${paidThisMonth.toFixed(2)}`;  // Update paid this month amount
}
