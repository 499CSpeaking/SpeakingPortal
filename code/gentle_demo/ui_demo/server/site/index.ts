function display_err(error: string): void {
    document.getElementById("output").innerHTML = `<i>error: ${error}</i>`
}

document.getElementById("button").onclick =  function buttonClick(): void {
    const text: string = (document.getElementById("text_input") as HTMLInputElement | null)?.value;
    const file: File = (document.getElementById("file_input") as HTMLInputElement | null)?.files[0];
    if(!text || text == "" || !file) {
        display_err("invalid input")
        return
    }

    const form_data: FormData = new FormData();
    form_data.append("audio", file)
    form_data.append("text", text)

    document.getElementById("output").innerHTML = "<i>processing...</i>"

    let error = false
    fetch("http://localhost:1234", {method: "POST", body: form_data})
    .then(response => {
        if(response.status != 200) {

            error = true
        }
        return response.text()
    })
    .then(response => {
        if(!error) {
            document.getElementById("output").innerHTML = response as string
        } else {
            throw new Error(response)
        }
    })
    .catch(err => {
        display_err(`server error: ${err.message}`)
    })
}