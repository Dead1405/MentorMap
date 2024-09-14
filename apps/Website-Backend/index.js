import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './src/routes/index.js'; // Your existing Express routes
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http';
import { Hono } from 'hono';

// Initialize dotenv
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000; // Provide a fallback port

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Hono and define Hono routes
const Videocallroutes = new Hono();

Videocallroutes.get('/healthcheck', async (c) => {
    return c.json({ message: 'worker is running' });
});

Videocallroutes.post('/llm', async (c) => {
    const { userMessage } = await c.req.json();
    const userMsgStr = JSON.stringify(userMessage);
    console.log(userMsgStr);

    const systemPrompt = {
        role: "system",
        content: "summarize only what mentor said into short and clear summary so that student can understand better"
    };
    const userPrompt = {
        role: "user",
        content: userMsgStr
    };
    const { response } = await c.env.AI.run(c.env.LLM_MODEL, {
        messages: [systemPrompt, userPrompt],
    });
    return c.json({ response });
});

// Error handling in Hono
Videocallroutes.onError((err, c) => {
    console.log('err : ', err);
    return c.text(err.message, err.status ? err.status : 500);
});

// Convert Hono's fetch method to Express middleware
const honoMiddleware = async (req, res, next) => {
    try {
        // Construct the full URL using the request's protocol, host, and original URL
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        // Create a new Hono Request using the full URL
        const honoReq = new Request(fullUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null,
        });
        console.log(honoReq);
        // Pass the request to Hono's fetch method and get the response
        const honoRes = await Videocallroutes.fetch(honoReq);

        // Send Hono's response back to Express
        res.status(honoRes.status);
        honoRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const responseBody = await honoRes.text();
        res.send(responseBody);
    } catch (err) {
        next(err);
    }
};


// Use Hono routes as middleware in Express
app.use('/honoapi', honoMiddleware); // Add Hono routes under '/api'

// Existing Express routes
app.use(router); // Your existing routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");

        // Create an HTTP server
        const server = http.createServer(app);

        // Initialize Socket.io
        const io = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        // Socket.io connection handling
        io.on("connection", (socket) => {
            console.log("User connected", socket.id);

            // Custom Socket.io events can go here
            socket.on("disconnect", () => {
                console.log("User disconnected", socket.id);
            });
        });

        // Start the server
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
