import { Hono } from 'hono';
const app = new Hono();

app.get('/healthcheck', async c => {
	return c.json({ message: 'worker is running' });
});

app.post('/llm', async (c: any) => {
	const { userMessage } = await c.req.json();
	const systemPrompt = {
		role: "system",
		content: "summarize only what mentor said into short and clear summary so that student can understand better"
	};
	const userPrompt = {
		role: "user",
		content: userMessage
	}
	const { response } = await c.env.AI.run(c.env.LLM_MODEL, {
		messages: [systemPrompt, userPrompt],
	});
	return c.json({ response });
});

app.onError((err: any, c) => {
	console.log('err : ', err);
	return c.text(err.message, err.status ? err.status : 500);
});

export default app;
