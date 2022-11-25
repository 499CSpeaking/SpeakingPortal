document.getElementById("button").onclick =  function buttonClick(): void {
    const text: string = (document.getElementById("text_input") as HTMLInputElement | null)?.value;
    if(!text || text == "") {
        console.error("cannot find text?")
        return
    }

    const file: File = (document.getElementById("file_input") as HTMLInputElement | null)?.files[0];
    if(file) {
        console.log(file)
    } else {
        console.error("file unread?")
        return
    }

    const form_data: FormData = new FormData();
    form_data.append("audio", file)
    form_data.append("text", text)

    fetch("http://localhost:1234", {method: "POST", body: form_data})
    .then(response => response.text())
    .then(response => {
        document.getElementById("output").innerHTML = response
    });
}