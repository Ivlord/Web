console.log('hi')
const requestURL = 'https://ivlord.github.io/Web/srv/srv.html?q=10&iv=30'

function getRq(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.onload = () => {
            if (xhr.status >= 400) {
                console.log("1>", xhr.response)
                reject( xhr.response) }
            else                   {
                console.log("2>", xhr.response)
                resolve(xhr.response) }
        }

        xhr.onerror = () => { reject(xhr.response) }

        xhr.send()
    })
}

let res = getRq(requestURL)
    .then(data => console.log(data))
    .catch(err => console.log(err))






/*
function getRq(method, url) {
    const headers = {'Content-Type':'application/json'}

    return fetch(url, {
        method: method,
        headers: headers
    }).then(response => {
        if (response.ok) { return response.json() }

        return response.json().then(error => {
            const e = new Error('Some error')
            e.data = error
            throw e
        })
    })
}

let res = getRq('GET', requestURL)
    .then(data => console.log(data))
    .catch(err => console.log(err))

console.log(res)


const body = {
    name: 'Vladilen',
    age: 26
}

sendRequest('POST', requestURL, body)
    .then(data => console.log(data))
    .catch(err => console.log(err))
*/
