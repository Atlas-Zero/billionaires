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
const countryList = async (request) => {
    response = await fetchData(request)
    data = await response.json()

    list = document.querySelector('#countries')
    keys = Object.keys(data)

    keys.forEach(key => {
        list.innerHTML += `<tr>
            <td> ${key} </td>
            <td> <button class="invis-button"
            onclick="indexList('${key}')"> ${data[key]} </td>
        </tr>`
    })
}
const indexList = async (country) => {
    response = await fetchData(`filter/country/${country}`)
    data = await response.json()

    ct = document.querySelector('#countryTable')
    nt = document.querySelector('#nameTable')
    ct.style.display = "none"
    nt.style.display = "block"

    list = document.querySelector('#billionaire')

    for (fullname of data) {
        parts = fullname.split("-")
        let first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        let last = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
        list.innerHTML += `<tr>
            <td> ${first} </td>
            <td> ${last} </td>
        </tr>`
    }
}

countryList("filter/country/_index")
