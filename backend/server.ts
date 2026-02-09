import express = require("express");
import GoogleAI = require("@google/generative-ai");
import dotenv = require("dotenv");
import cors = require("cors");
import Groq = require("groq-sdk");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const groq = new Groq.Groq({apiKey: process.env.GROK_KEY});
const GeminiLLM: string = process.env.GEMINI_KEY as string;
const gemini = new GoogleAI.GoogleGenerativeAI(GeminiLLM);

app.post("/analyze", async (req, res) => {
    console.log("STARTING ANALAZYING....");
    const { input } = req.body;
    if (!input) return res.status(400).json({ message: "Message is empty" });
    try {
        const modelGemini = gemini.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const response = await modelGemini.generateContent(input);

        const data = await response.response;
        return res.json({reply: data.text()});
    } catch (error) {
        console.log("⚠️ Gemini down, switching to Groq (Llama 3)...");
        try {
            const chatCompletion = await groq.chat.completions.create({
                "messages": [
                    {
                        "role": "user",
                        "content": input
                    }
                ],
                "model": "llama-3.1-8b-instant",
                "temperature": 1,
                "max_completion_tokens": 1024,
                "top_p": 1,
                "stream": false,
                "stop": null
            });

            const reply = chatCompletion.choices[0]?.message?.content || "";
            return res.json({reply: reply});
            
        } catch (error) {
            console.error("All LLMs are down, error: ", error);
            return res.send("All LLMs are down");
        }
    }
});


app.listen(3000, () => console.log("Server is working on 3000 port"));