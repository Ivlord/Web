
const requestURL = 'https://ivlord.github.io/Web/srv/srv.html?q=10&iv=30'

function getRq(url) {
    const headers = {'Content-Type':'application/json'}

    return fetch(url, {
        method: 'GET',
        headers: headers
    }).then(response => {
        //if (response.ok) {
            console.log('response:', response.body.toString())
            return response.body
        //}

/*        return response.body.then(error => {
            const e = new Error('Some error')
            e.data = error
            throw e
        })*/
    })
}

let res = getRq(requestURL)
    .then(data => console.log(data))
    .catch(err => console.log(err))

console.log(res)
