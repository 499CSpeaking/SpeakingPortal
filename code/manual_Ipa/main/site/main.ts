const char_lim = 300;
let button = document.getElementById("send");

function log_status(message) {
  document.getElementById("out").innerHTML += `${message}<br>`;
}

function clear_output() {
  document.getElementById("out").innerHTML = "";
}

button.onclick = async function getOut() {
  clear_output();
  // input error checking
  let input = (document.getElementById("userInput") as HTMLInputElement | null)
    ?.value;
  if (!input || input == "") {
    log_status("text input cannot be empty!");
    return;
  }

  if (input.length > char_lim) {
    log_status("text input exceeds the character limit!");
    return;
  }
  // generate phonemes
  log_status("Starting...");
  log_status("Getting Phonemes...");
  let phonemes = new Map();
  phonemes = getPhones(input);
  log_status("Phoneme Detection Complete!");
  // get audio from kukarella
  let file;
  try {
    file = await get_kuk_aud(input);
  } catch (e) {
    log_status(
      `An error occurred while getting the audio from Kukarella! Error Message: ${e.message}`
    );
    return;
  }

  // send audio to server for processing
  log_status("Sending audio to the server for further processing...");
  let stamps = new Map();
  try {
    // send audio file to server and get result of timestamps
    getTime(file);
  } catch (e) {
    log_status(
      `An error occurred while sending the audio to server or while processing! Error Message: ${e.message}`
    );
  }
};

// function to send user input to the server for phoneme generation, and to retrieve the phoneme data
function getPhones(input): any {
  let userInput = input.toLowerCase();
  // send string to server and get response
  fetch("http://localhost:4000/api", {
    method: "POST",
    body: JSON.stringify({ input: userInput }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => {
      let respo = data.output;
      let html$ = "";
      for (var key in respo) {
        html$ += "<p>" + key + ", " + respo.get(key) + "</p>";
      }
      log_status(html$);
      return respo;
    });
}

// function to retrieve audio from kukarella's api based on user inputted text
async function get_kuk_aud(text) {
  const api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview";

  const payload = {
    text: text,
    voiceKey: "en-US_AllisonV3Voice",
  };

  const api_respo = await fetch(api_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  log_status("Getting Audio from Kukarella...");
  const audio_url = (await api_respo.json()).data.url;
  let url_message =
    "Audio has been retrieved. You can download it <a href=" +
    audio_url +
    ">HERE</a>";
  log_status(url_message);

  const audio_resp = await fetch(audio_url);
  const audio_resp_blob = await audio_resp.blob();

  return new File([audio_resp_blob], "arbitrary_filename");
}

// function to send audio to server and get timestamps for each word
function getTime(audio) {
  const form_data = new FormData();
  form_data.append("file", audio);
  let err = false;
  fetch("http://localhost:4000/api/time", {
    method: "POST",
    body: form_data,
    headers: { enctype: "multipart/form-data" },
  })
    .then((res) => {
      if (res.status != 200) {
        err = true;
      }
      return res.text();
    })
    .then((res) => {
      if (!err) {
        log_status("Processing Complete!<br>");
      } else {
        throw new Error(res);
      }
    })
    .catch((err) => {
      log_status(
        `An error occurred while processing! Error Message: ${err.message}`
      );
    });
}

// check and display the number of characters the user has typed
document.getElementById("char_count").innerHTML = `0/${char_lim}`;
document.getElementById("userInput").addEventListener("input", () => {
  const char_count: number = (
    document.getElementById("userInput") as HTMLInputElement | null
  )?.value.length;
  document.getElementById("char_count").innerHTML =
    char_count <= char_lim
      ? `${char_count}/${char_lim}`
      : `<p style="color:red;"> ${char_count}/${char_lim} </p>`;
});
