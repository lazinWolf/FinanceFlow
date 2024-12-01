// Tab functionality
const tabs = document.querySelectorAll(".tab");
const contentWindow = document.querySelector(".content-window");
const heading = document.querySelector(".content-window h2");
const fullPageLink = document.getElementById("fullPageLink");
const ctx = document.getElementById("dashboardChart").getContext("2d");
let dashboardChart;

// Data for each tab's chart
const chartData = {
    overview: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: 'Income',
                data: [500, 700, 800, 950, 1000, 1100, 1150, 1200, 1300, 1400, 1500, 1600],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Expenses',
                data: [450, 550, 600, 700, 800, 750, 800, 850, 900, 950, 1000, 1050],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }
        ]
    },
    income: {
        label: 'Monthly Income Growth',
        data: [1000, 1200, 1200, 1159, 1450, 1300, 1550, 1550, 1550, 1700, 1650, 1800],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
    },
    expenses: {
        label: 'Monthly Expenses Growth',
        data: [500, 600, 300, 800, 560, 800, 670, 690, 650, 700, 1050, 1100],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)'
    },
    bills: {
        label: 'Monthly Bills Growth',
        data: [300, 350, 350, 400, 500, 523, 573, 669, 700, 772, 800, 783],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)'
    },
    goals: {
        label: 'Goals Completion Rate (%)',
        data: [20, 30, 50, 60, 55, 80, 30, 35, 80, 60, 20, 60],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)'
    }
};

// Headings for each tab
const tabHeadings = {
    overview: "Financial Overview: Income vs. Expenses",
    income: "Monthly Income Growth",
    expenses: "Monthly Expenses Growth",
    bills: "Monthly Bills Growth",
    goals: "Goals Completion Rate"
};

// Function to update the chart for each tab
function updateChart(tabName) {
    let data = tabName === "overview" ? chartData.overview : {
        labels: chartData.overview.labels,
        datasets: [{
            label: chartData[tabName].label,
            data: chartData[tabName].data,
            backgroundColor: chartData[tabName].backgroundColor,
            borderColor: chartData[tabName].borderColor,
            borderWidth: 2,
            fill: true,
            tension: 0.1
        }]
    };

    // Destroy previous chart instance if it exists
    if (dashboardChart) dashboardChart.destroy();

    // Create new chart instance
    dashboardChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Months' }
                },
                y: {
                    title: { display: true, text: 'Amount/Percent' }
                }
            }
        }
    });
}

// Function to update content and link for each tab
function updateContent(tabName) {
    const linkMap = {
        overview: "/overview",
        income: "/income",
        expenses: "/expenses",
        bills: "/bills",
        goals: "/goals"
    };
    heading.textContent = tabHeadings[tabName] || "Financial Overview";
    fullPageLink.href = linkMap[tabName] || "#";
    updateChart(tabName);
}

// Set up tab event listeners
tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".tab.active").classList.remove("active");
        tab.classList.add("active");
        updateContent(tab.classList[1]);
    });
});

// Initialize the default content
updateContent("overview");

// Tips functionality
const tips = [
    "💡 Make sure your goals are completed in advance. Don't wait till the end.",
    "💡 Reminder: Review your subscription expenses to identify potential savings.",
    "💡 Planning meals can reduce your dining expenses and improve your budget control.",
    "💡 Keep a track of your expenses category wise to avoid overspending."
];
let currentTipIndex = 0;

function showTip(index) {
    const tipContent = document.getElementById("tip-content");
    tipContent.textContent = tips[index];
}

document.querySelector(".left-arrow").addEventListener("click", () => {
    currentTipIndex = (currentTipIndex > 0) ? currentTipIndex - 1 : tips.length - 1;
    showTip(currentTipIndex);
});

document.querySelector(".right-arrow").addEventListener("click", () => {
    currentTipIndex = (currentTipIndex < tips.length - 1) ? currentTipIndex + 1 : 0;
    showTip(currentTipIndex);
});

// Initialize the first tip
showTip(currentTipIndex);
