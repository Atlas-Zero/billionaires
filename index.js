
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
    latest = dayjs(latest);
    const latestMonth = latest.subtract(1, 'month').format("YYYY-MM");
    console.log(latestMonth);
    const currTopTen = responseObj["list"][latestMonth] // this might lead to errors in the future

    renderTopTen(currTopTen)
}

const renderTopTen = async (tt) => {

    for (let i = 0; i < 10; i++) {
        let tableData = document.querySelector(`#rank${i + 1}`)

        // e.g. "elon-musk"
        let uri = tt[i].uri
        let parts = uri.split("-")

        if (parts.length === 2) {
            // capitalize both parts
            let first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
            let last = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)

            // Elon_Musk (for Wikipedia Links)
            uri = `${first}_${last}`
        }

        tableData.innerHTML += `<td>${tt[i].rank}</td>`
        tableData.innerHTML += `<td><a href="https://en.wikipedia.org/wiki/${uri}">${uri.replace("_", " ")}</a></td>`
        tableData.innerHTML += `<td>$${(tt[i].networth / 1000).toFixed(3)}B</td>`
    }
}

getTopTen("stats/top10")