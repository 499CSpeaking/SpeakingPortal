import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";
async function query(filename) {
	const data = fs.readFileSync(filename);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/facebook/wav2vec2-xlsr-53-espeak-cv-ft",
		{
			headers: { Authorization: "Bearer {API_TOKEN}" },
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

query("audio/input/Test.wav").then((response) => {
	console.log(JSON.stringify(response));
});

