const fetchData = async (request) => {

    const response = await fetch(`https://cdn.jsdelivr.net/gh/komed3/rtb-api@main/api/${request}`)

    if (response.ok) {
        console.log("status", response.status + ":", request)
        return response
    } else {
        console.error("HTTP Error: ", response.status)
        alert.danger()
    }
}

let newChart;

window.onload = () => {
    const fromDate = document.getElementById("from-date").value;
    const toDate = document.getElementById("to-date").value;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    getTotalChart(from, to);
}

document.getElementById("submit-dates").addEventListener("click", () => {
    if(newChart){
        newChart.destroy();
    }
    const fromDate = document.getElementById("from-date").value;
    const toDate = document.getElementById("to-date").value;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
    // Now call your chart loader

    getTotalChart(from, to); // replace "someRequestKey" with your actual value
});


const getTotalChart = async (from, to) => {

    const response = await fetchData("stats/total")

    const text = await response.text()
    const lines = text.trim().split('\n')
    const labels = []
    const data = []

    lines.forEach(line => {
        const [date, value] = line.split(' ')
        labels.push(date)
        data.push(parseFloat(value))
        //console.log(date);
    })

    //filtering
    const filteredLabels = [];
    const filteredData = [];

    for (let i = 0; i < labels.length; i++) {
        const currentDate = new Date(labels[i]);
        if (currentDate >= from && currentDate <= to) {
            filteredLabels.push(labels[i]);
            filteredData.push(data[i]);
        }
        console.log(filteredData[1]);
        console.log(filteredLabels[1]);
    }


    renderTotalChart(filteredLabels, filteredData);

}

const renderTotalChart = async (dates, values) => {
    const totalDuration = 3000;
    const delayBetweenPoints = totalDuration / values.length;

    const previousY = (ctx) => {
        if (ctx.index === 0) {
            return ctx.chart.scales.y.getPixelForValue(100); // adjust this as needed
        }
        const prev = ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1];
        return prev.getProps(['y'], true).y;
    };

    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const chart = document.querySelector('#total');
    const ctx = chart.getContext("2d");

    newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: "Total Stats",
                data: values,
                fill: true,
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderColor: 'rgba(13, 110, 253, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            animation: animation,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            },
            elements: {
                point: {
                    radius: 3
                }
            }
        }
    });
};
