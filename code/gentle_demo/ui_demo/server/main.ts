const express: any = require("express")
const body_parser: any = require("body-parser")
const multer: any = require("multer")
const gentle: any = require("../../demo")
const fs: any = require("fs")

const app: any = express()
const upload = multer({dest: "uploads/"})

app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended: true
}))

app.use(express.static("site"))

app.post("/", upload.single("audio"), (req, res) => {
    let audio_filename: string = req.file.filename
    let text: string = req.body.text
    let text_filename: string = audio_filename + "_text"

    fs.writeFileSync("uploads/" + text_filename, text)
    const output = gentle("uploads/" + audio_filename, "uploads/" + text_filename)
    
    res.send(output)

    fs.unlinkSync("uploads/" + audio_filename)
    fs.unlinkSync("uploads/" + text_filename)
})

app.post("/testing", upload.none(), (req, res) => {
    res.send(req.body.text)
})

const port: number = 1234
app.listen(port, () => {
    console.log("started server on " + port)
})