import express from  "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import cors from "cors"
import Groq from "groq-sdk"
import { DEBUG_PROMPT } from "./debug.js";
import { EXPLAIN_PROMPT } from "./explain.js";
import { OPTIMIZE_PROMPT } from "./optimize.js";
import axios from "axios"
import { error } from "node:console"
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const groq = new Groq.Groq({apiKey: process.env.GROK_KEY});

interface Analyze {
    input: string,
    model: number
};


app.post("/analyze", async (req, res) => {
    const { input, model }:Analyze = req.body;
    const systemPrompt:string = model == 0 ? EXPLAIN_PROMPT : model == 1 ? DEBUG_PROMPT : OPTIMIZE_PROMPT;
    if (!input) return res.status(400).json({ message: "Message is empty" });

        try {
            const chatCompletion = await groq.chat.completions.create({
                "messages": [
                    {
                        "role": "system",
                        "content": systemPrompt
                    },
                    {
                    "role" : "user",
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
            return res.json({reply: reply});
            
        } catch (error) {
            console.error("All LLMs are down, error: ", error);
            return res.send("All LLMs are down");
        }
});

interface Compile {
    code : string,
    lang: number
};

app.post("/api/compile", async(req, res) => {
const {code, lang} = req.body;
if(!code || !lang) return res.status(400);

const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    data: {
    source_code: code,
    language_id: lang
    },
    params: {
        base64_encoded: false,
        wait: 'true'
    },
    headers: {
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'x-rapidapi-key': '6f0d76c5bbmsh1369f3e130fa632p1b4a78jsn1a5358fe1646',
        'Content-Type' : 'application/json'
    }

};

try {
    const response = await axios.request(options);
    return res.json({output: response.data.stdout, error: response.data.stderr})
} catch(error) {
    console.error(error);
}
});


app.listen(3000, () => console.log("Server is working on 3000 port"));