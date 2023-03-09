// max character limit checking
const char_lim = 300;
let button = document.getElementById("send");

// print messages to user on the web
function log_status(message) {
  document.getElementById("out").innerHTML += `${message}<br>`;
}

// clear the message board
function clear_output() {
  document.getElementById("out").innerHTML = "";
}

// main function to get final output to user
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

  // get other input data
  let aligner = document.getElementById("aligner").value;
  let voiceKey = document.getElementById("voiceKey").value;
  let avatar = document.getElementById("avatar").value;

  // get audio from kukarella
  log_status("Getting Audio from Kukarella...");
  fetch("http://localhost:4000/kuk", {
    method: "POST",
    body: JSON.stringify({ inputString: input, voiceKey: voiceKey }),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then(async (res) => await res.json())
    .then((data) => {
      let audioPath = data.audioPath;
      log_status("Generated audio in server location: "+audioPath);
    });

  // get transcript from aligner
  log_status("Getting Transcript from "+aligner);

};

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
