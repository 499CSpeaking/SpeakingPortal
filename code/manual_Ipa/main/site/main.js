function getOut() {
    var input = document.getElementById('userInput');
    var userInput = input.value.toLowerCase();
    //send string to server and get response
    fetch('http://localhost:4000/api', {
        method: 'POST',
        body: JSON.stringify({ input: userInput }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var respo = data.output;
        var html$ = '';
        for (var key in respo) {
            html$ += "<span>" + key + ", " + respo.get(key) + "</span>";
        }
        document.getElementById("out").innerHTML = html$;
    });
}
