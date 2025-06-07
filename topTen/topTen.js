let currentMonthIndex = 0;
let sortedMonths = [];
let monthData = {};
let intervalId = null;

const fetchData = async (request) => {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/komed3/rtb-api@main/api/${request}`);
    if (response.ok) {
        return response;
    } else {
        console.error("HTTP Error:", response.status);
    }
};

const getTopTen = async () => {
    const response = await fetchData("stats/top10");
    const data = await response.json();

    sortedMonths = Object.keys(data.list).sort(); // oldest to latest
    monthData = data.list;

    const latestMonth = sortedMonths[sortedMonths.length - 1]; // 🟢 display latest by default

    const topTen = calculateChange(latestMonth);
    renderTopTen(topTen, latestMonth);
    document.getElementById("currentMonth").textContent = dayjs(latestMonth).format("MMMM YYYY");
};

const calculateChange = (currentMonth) => {
    const currentMonthIndex = sortedMonths.indexOf(currentMonth);
    const previousMonth = sortedMonths[currentMonthIndex - 1];
    const previousData = monthData[previousMonth] || [];

    const currentData = monthData[currentMonth];

    const enriched = currentData.map(billionaire => {
        const previous = previousData.find(b => b.uri === billionaire.uri);
        const previousNetworth = previous ? previous.networth : billionaire.networth;
        const change = billionaire.networth - previousNetworth;
        const arrow = change >= 0
            ? `<span style="color:limegreen;">&#8679;</span>`
            : `<span style="color:red;">&#8681;</span>`;
        return { 
            ...billionaire,
            change,
            arrow
        };
    });

    return enriched.sort((a, b) => b.networth - a.networth).slice(0, 10);
};


const renderTopTen = (topTen, currentMonth) => {
    for (let i = 0; i < 10; i++) {
        const tableData = document.querySelector(`#rank${i + 1}`);
        tableData.innerHTML = ""; // Clear previous content
        let uri = topTen[i].uri;
        let parts = uri.split("-");

        if (parts.length === 2) {
            let first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            let last = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            uri = `${first}_${last}`;
        }

        tableData.innerHTML += `<td>${i + 1}</td>`;
        tableData.innerHTML += `<td><a href="https://en.wikipedia.org/wiki/${uri}" target="_blank">${uri.replace("_", " ")}</a></td>`;
        tableData.innerHTML += `<td>$${(topTen[i].networth / 1000).toFixed(3)}B ${topTen[i].arrow}</td>`;
    }
};


const startAutoCycle = () => {
    if (intervalId) return; // Prevent multiple intervals

    currentMonthIndex = 0; // Always start from beginning

    intervalId = setInterval(() => {
        if (currentMonthIndex >= sortedMonths.length) {
            stopAutoCycle();
            return;
        }
        const month = sortedMonths[currentMonthIndex];
        const topTen = calculateChange(month);
        renderTopTen(topTen, month);
        document.getElementById("currentMonth").textContent = dayjs(month).format("MMMM YYYY");
        currentMonthIndex++;
    }, 1500); // 3 seconds per cycle
};


const stopAutoCycle = () => {
    clearInterval(intervalId);
    intervalId = null;
};

const resetCycle = () => {
    clearInterval(intervalId);
    intervalId = null;

    const latestMonth = sortedMonths[sortedMonths.length - 1];

    const topTen = calculateChange(latestMonth);  // <-- HIER
    renderTopTen(topTen, latestMonth);
    document.getElementById("currentMonth").textContent = dayjs(latestMonth).format("MMMM YYYY");
};

// Button Events
document.getElementById("playButton").addEventListener("click", startAutoCycle);
document.getElementById("stopButton").addEventListener("click", stopAutoCycle);
document.getElementById("resetButton").addEventListener("click", resetCycle);

// Initial Load
getTopTen();
