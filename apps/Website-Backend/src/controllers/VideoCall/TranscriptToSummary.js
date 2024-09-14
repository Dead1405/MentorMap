import { Hono } from 'hono';
import ApiResponse from '../../utils/ApiResponse.js';
const app = new Hono();

const HealthCheck = (req, res) => {
    return res.json(new ApiResponse(200, "llm is working"))
}

const TextToSummary = async (req, res,c) => {
    console.log(req.body);
    const { userMessage } = await req.body;
    const userMsgStr = JSON.stringify(userMessage)
    console.log(userMsgStr);

    const systemPrompt = {
        role: "system",
        content: "summarize only what mentor said into short and clear summary so that student can understand better"
    };
    const userPrompt = {
        role: "user",
        content: userMsgStr
    }
    const { response } = await c.env.AI.run(c.env.LLM_MODEL, {
        messages: [systemPrompt, userPrompt],
    });
    return c.json({ response });
}

export {
    TextToSummary,
    HealthCheck
}