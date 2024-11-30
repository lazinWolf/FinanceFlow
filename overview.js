// Load JSON data and initialize the page
fetch("overview.json")
    .then(response => response.json())
    .then(data => {
        initializeHeader(data.header);
        initializePageContent(data.pageContent);
        initializeCharts(data.charts);
    })
    .catch(error => console.error("Error loading JSON:", error));

// Initialize Header
function initializeHeader(headerData) {
    document.getElementById("logoImage").src = headerData.logoSrc;
    document.getElementById("notificationIcon").src = headerData.notificationIcon;
    document.getElementById("profileIcon").src = headerData.profileIcon;

    const navbar = document.getElementById("navbar");
    headerData.navLinks.forEach(link => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.text;
        if (link.active) a.classList.add("active");
        a.classList.add("nav-btn");
        navbar.appendChild(a);
    });
}

// Initialize Page Content
function initializePageContent(contentData) {
    document.title = contentData.title;
    document.getElementById("pageTitle").textContent = contentData.pageTitle;

    // Summary Cards
    const summaryCards = document.getElementById("summaryCards");
    contentData.summary.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", card.class);  // Apply individual class for each card type
        cardDiv.style.backgroundColor = getCardBackgroundColor(card.class);  // Inline style as a backup for visibility
        cardDiv.innerHTML = `<h3>${card.title}</h3><p>${card.value}</p>`;
        summaryCards.appendChild(cardDiv);
    });

    // Insights Section
    const insightsSection = document.getElementById("insightsSection");
    contentData.insights.forEach(insight => {
        const insightCard = document.createElement("div");
        insightCard.classList.add("insight-card", insight.class);  // Apply individual class for each insight card type
        insightCard.style.backgroundColor = getCardBackgroundColor(insight.class);  // Inline style as a backup for visibility
        insightCard.innerHTML = `<h3>${insight.title}</h3>`;
        
        const items = document.createElement("ul");
        insight.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = typeof item === "string" ? item : `${item.label}: ${item.value}`;
            items.appendChild(li);
        });
        insightCard.appendChild(items);

        if (insight.growth) {
            const growthIndicator = document.createElement("p");
            growthIndicator.innerHTML = `Monthly Growth: <span class="growth-value">${insight.growth}</span>`;
            insightCard.appendChild(growthIndicator);
        }

        insightsSection.appendChild(insightCard);
    });
}

// Map class names to background colors for inline styling
function getCardBackgroundColor(cardClass) {
    const colorMap = {
        "card-balance": "#e0f7fa",
        "card-income": "#fff9c4",
        "card-credit": "#ffebee",
        "top-spending-categories": "#ffecb3",
        "goals-summary": "#d1c4e9",
        "savings-growth": "#d1f2eb"
    };
    return colorMap[cardClass] || "#ffffff";  // Default to white if class is not found
}

// Initialize Charts
function initializeCharts(chartData) {
    const financialHealthCanvas = document.getElementById("financialHealthChart");
    const savingsGrowthCanvas = document.getElementById("savingsGrowthChart");

    // Income vs Expenses Chart (Bar Chart)
    new Chart(financialHealthCanvas, {
        type: 'bar',
        data: {
            labels: chartData.financialHealth.labels,
            datasets: [
                {
                    label: 'Income (₹)',
                    data: chartData.financialHealth.income,
                    backgroundColor: 'rgba(0, 123, 255, 0.6)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses (₹)',
                    data: chartData.financialHealth.expenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Amount (₹)' } } }
        }
    });

    // Financial Overview Chart (Doughnut Chart)
    new Chart(savingsGrowthCanvas, {
        type: 'doughnut',
        data: {
            labels: chartData.financialOverview.labels,
            datasets: [{
                data: chartData.financialOverview.data,
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: { responsive: false }
    });
}
