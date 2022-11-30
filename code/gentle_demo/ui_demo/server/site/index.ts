const char_limit: number = 200

function log_output(message: string, error: boolean = false): void {
    document.getElementById("output").innerHTML += !error ? `${message}<br>` : `<p style="color:red;"> ${message}<br></p>`
}

function clear_output(): void {
    document.getElementById("output").innerHTML = ''
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

    log_output(`requesting text-to-speech transcription of the text from Kukarella...`)
    const audio_url: string = (await api_response.json()).data.url
    log_output(`The audio from Kukarella has been processed, you can download it <a href=${audio_url}>HERE</a>`)

    const audio_response: any = await fetch(audio_url)

    const audio_response_blob: Blob = await audio_response.blob()

    return new File([audio_response_blob], "arbitrary_filename")
}

document.getElementById("button").onclick =  async function buttonClick(): Promise<void> {
    clear_output()

    const text: string = (document.getElementById("text_input") as HTMLInputElement | null)?.value;
    if(!text || text == "") {
        log_output("text input must be filled", true)
        return
    }

    if(text.length > char_limit) {
        log_output("text input exceeds the character limit", true)
        return
    }

    log_output("starting")

    let file: File
    try {
        file = await get_audio_from_kukarella(text)
    } catch(e) {
        log_output(`an error occurred while requesting the text-to-speech transcription from Kukarella: ${e.message}`, true)
        return
    }
    const form_data: FormData = new FormData();
    form_data.append("audio", file)
    form_data.append("text", text)

    log_output(`sending both the text and audio to the server for alignment...`)
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
            log_output("process completed<br>")
            log_output(response as string)
        } else {
            throw new Error(response)
        }
    })
    .catch(err => {
        log_output(`an error occured while requesting the text alignment from the server: ${err.message}`, true)
    })
}

document.getElementById("char_count").innerHTML = `0/${char_limit}`
document.getElementById("text_input").addEventListener("input", () => {
    const char_count: number = (document.getElementById("text_input") as HTMLInputElement | null)?.value.length;
    document.getElementById("char_count").innerHTML = ( char_count <= char_limit ? `${char_count}/${char_limit}` : `<p style="color:red;"> ${char_count}/${char_limit} </p>`)
})