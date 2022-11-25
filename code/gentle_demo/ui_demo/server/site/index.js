document.getElementById("button").onclick = function buttonClick() {
    var _a, _b;
    var text = (_a = document.getElementById("text_input")) === null || _a === void 0 ? void 0 : _a.value;
    if (!text || text == "") {
        console.error("cannot find text?");
        return;
    }
    var file = (_b = document.getElementById("file_input")) === null || _b === void 0 ? void 0 : _b.files[0];
    if (file) {
        console.log(file);
    }
    else {
        console.error("file unread?");
        return;
    }
    var form_data = new FormData();
    form_data.append("audio", file);
    form_data.append("text", text);
    fetch("http://localhost:1234", { method: "POST", body: form_data })
        .then(function (response) { return response.text(); })
        .then(function (response) {
        document.getElementById("output").innerHTML = response;
    });
};
