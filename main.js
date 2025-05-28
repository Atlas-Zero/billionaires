
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
    

    const getTopTen = async (request) => {

        const response = await fetchData(request)
        const responseObj = await response.json()

        let latest = await (await fetchData("latest")).text();
        const prevMonth = dayjs().subtract(1, 'month').format("YYYY-MM")
        console.log(prevMonth);
        const currTopTen = responseObj["list"][prevMonth] // this might lead to errors in the future

        renderTopTen(currTopTen)
    }

    const getTotal = async (request) => {

        const response = await fetchData(request)

        const text = await response.text()
        const lines = text.trim().split('\n')
        const labels = []
        const data = []

        lines.forEach(line => {
            const [date, value] = line.split(' ')
            labels.push(date)
            data.push(parseFloat(value))
        })

        renderTotal(labels, data)

    }

    const renderTopTen = async (tt) => {

        for (let i = 0; i < 10; i++) {
            let tableData = document.querySelector(`#rank${i + 1}`)

            let uri = tt[i].uri
            let parts = uri.split("-")

            if (parts.length === 2) {
                // capitalize both parts
                let first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
                let last = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)

                uri = `${first}_${last}`
            }

            tableData.innerHTML += `<td>${tt[i].rank}</td>`
            tableData.innerHTML += `<td><a href="https://en.wikipedia.org/wiki/${uri}">${uri.replace("_", " ")}</a></td>`
            tableData.innerHTML += `<td>$${ (tt[i].networth / 1000).toFixed(3) }B</td>`
        }
    }

    const renderTotal = async (dates, values) => {

        const chart = document.querySelector('#total')
        const ctx = chart.getContext("2d")

        new Chart(ctx, {
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
                scales: {
                    y: {
                        beginAtZero: true
                    },
                }
            }
        })
    }

getTopTen("stats/top10")
getTotal("stats/total")


async function latestWinnersPrc(request) {
    data = await fetchData("movers/pct/winner/latest")
    data = await data.json()
    console.log(data)
}