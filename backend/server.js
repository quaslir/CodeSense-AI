"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const GoogleAI = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");
const Groq = require("groq-sdk");
const debug_1 = require("./debug");
const explain_1 = require("./explain");
const optimize_1 = require("./optimize");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const groq = new Groq.Groq({ apiKey: process.env.GROK_KEY });
const GeminiLLM = process.env.GEMINI_KEY;
const gemini = new GoogleAI.GoogleGenerativeAI(GeminiLLM);
app.post("/analyze", async (req, res) => {
    console.log("STARTING ANALAZYING....");
    const { input, model } = req.body;
    const systemPrompt = model == 0 ? explain_1.EXPLAIN_PROMPT : model == 1 ? debug_1.DEBUG_PROMPT : optimize_1.OPTIMIZE_PROMPT;
    if (!input)
        return res.status(400).json({ message: "Message is empty" });
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    content: `My cod is \n\n${input}`
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
        return res.json({ reply: reply });
    }
    catch (error) {
        console.error("All LLMs are down, error: ", error);
        return res.send("All LLMs are down");
    }
});
app.listen(3000, () => console.log("Server is working on 3000 port"));
//# sourceMappingURL=server.js.map