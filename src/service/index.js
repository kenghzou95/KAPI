var log = {
    push: function (props) {

        var message = props.message,
            type = props.type
        if (typeof message === "object") message = JSON.stringify(message)
        if (typeof message !== "string") message = message.toString();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, type })
        };
        fetch('http://127.0.0.1:1880/api/cpd/log', requestOptions)
            .then(response => response.json())
    }
}

var api = {
    post: async function (url, parameter) {


        for (var key in parameter) {
            url = url.replace(key, parameter[key])
        }
        url = url + parameter['additionParameter']
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: parameter.body
        };
        console.log(requestOptions)
        const response = await fetch(`http://127.0.0.1:1880${url}`, requestOptions)
            .then(response => response.json())

        return response;

    },
    get: async function (url, parameter) {
        console.log(typeof parameter);

        //if (typeof parameter === "object") message = JSON.stringify(message)
        //if (typeof message !== "string") message = message.toString();
        for (var key in parameter) {
            url = url.replace(key, parameter[key])
        }
        url = url + parameter['additionParameter']
        console.log(`http://127.0.0.1:1880${url}`)
        const response = await fetch(`http://127.0.0.1${url}`)
            .then(response => response.json())

        return response;
    },
    delete: async function (url, parameter) {




        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { 'hello': 'world' }
        };

        const response = await fetch(`http://127.0.0.1:1880${url}`, requestOptions).then(response => response)

        return response;

    },
}

var TestScript = {
    first: function (url, body) {
        let param = url.match(/(\{.+?\})/g);

        const content = ""
        const myHeaders = new Headers({
            'Content-Type': ' application/json',
            'Content-Length': content.length.toString()
        });

        const myRequest = new Request(url, {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        });

    },
    second: function (url, body) {
        const rgx = /(\{.+?\})/g;
        let param = url.match(rgx);
        param.forEach((item) => {
            url = url.replace(item, body[item])
        })
        const content = ""
        const myHeaders = new Headers({
            'Content-Type': ' application/json',
            'Content-Length': content.length.toString()
        });

        const myRequest = new Request(url, {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        });
    }

}

export { log, TestScript, api }