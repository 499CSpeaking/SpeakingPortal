function display_err(error: string): void {
    document.getElementById("output").innerHTML = `<i>error: ${error}</i>`
}

async function get_audio_from_kukarella(text: string): Promise<File> {
    const kukarella_api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview"

    const payload = {
        text: text,
        voiceKey: 'en-US_AllisonV3Voice',
    };

    const api_response: any = await fetch(kukarella_api_url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const audio_url: string = (await api_response.json()).data.url
    const audio_response: any = await fetch(audio_url)

    const audio_response_blob: Blob = await audio_response.blob()

    return new File([audio_response_blob], "arbitrary_filename")
}

document.getElementById("button").onclick =  async function buttonClick(): Promise<void> {
    const text: string = (document.getElementById("text_input") as HTMLInputElement | null)?.value;
    if(!text || text == "") {
        display_err("invalid input")
        return
    }

    document.getElementById("output").innerHTML = "<i>processing...</i>"

    const file: File = await get_audio_from_kukarella(text)

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