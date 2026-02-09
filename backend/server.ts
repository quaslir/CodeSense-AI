import express = require("express")
import GoogleAI = require("@google/generative-ai");
import dotenv = require("dotenv")
const app = express();
dotenv.config();
app.use(express.json());
const GeminiLLM :string = process.env.GEMINI_KEY as string;
const gemini = new GoogleAI.GoogleGenerativeAI(GeminiLLM);

app.get("/gemini", async(req, res) => {
    try {
        const modelGemini = gemini.getGenerativeModel({model: "gemini-3-flash-preview"});

        const response = await modelGemini.generateContent("Say hello world");

        const data = await response.response;

        console.log(data.text());
    } catch(error) {
        console.error(error);
        res.status(500);
    }
})

app.listen(3000, () => console.log("Server is working on 3000 port"));