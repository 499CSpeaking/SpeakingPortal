function display_err(error) {
    document.getElementById("output").innerHTML = "<i>error: " + error + "</i>";
}
document.getElementById("button").onclick = function buttonClick() {
    var _a, _b;
    var text = (_a = document.getElementById("text_input")) === null || _a === void 0 ? void 0 : _a.value;
    var file = (_b = document.getElementById("file_input")) === null || _b === void 0 ? void 0 : _b.files[0];
    if (!text || text == "" || !file) {
        display_err("invalid input");
        return;
    }
    var form_data = new FormData();
    form_data.append("audio", file);
    form_data.append("text", text);
    document.getElementById("output").innerHTML = "<i>processing...</i>";
    var error = false;
    fetch("http://localhost:1234", { method: "POST", body: form_data })
        .then(function (response) {
        if (response.status != 200) {
            error = true;
        }
        return response.text();
    })
        .then(function (response) {
        if (!error) {
            document.getElementById("output").innerHTML = response;
        }
        else {
            throw new Error(response);
        }
    })
        .catch(function (err) {
        display_err("server error: " + err.message);
    });
};
