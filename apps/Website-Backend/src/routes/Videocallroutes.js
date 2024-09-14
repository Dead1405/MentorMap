import { Hono } from 'hono';
const Videocallroutes = new Hono();

Videocallroutes.get('/healthcheck', async (c, next) => {
    return c.json({ message: 'worker is running' });
});

Videocallroutes.post('/llm', async (c, next) => {

    const { userMessage } = await c.req.json();
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
});

Videocallroutes.onError((err, c) => {
    console.log('err : ', err);
    return c.text(err.message, err.status ? err.status : 500);
});

export { Videocallroutes };