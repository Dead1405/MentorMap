import Express, { response } from "express";
import UserRouter from "./UserRoutes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import BlogRouter from "./BlogRoutes.js";
import axios from "axios";
import FaqRoutes from "./FaqRoutes.js";
const router = Express.Router();

router.get("/", (req, res) => {
  res.send("API is working");
});

router.get('/api/mentors/:mentorId/availability', async (req, res) => {
  try {
    const response = await axios.get(`https://calendly.com/api/v1/users/${req.params.mentorId}/event_types`, {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching availability');
  }
});

router.post('/chat', async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Help me with this statement:Give answer in a decent english language" + req.body.message;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send({ message: result.response.text() });
});


router.use("/api/v1/user", UserRouter);
router.use("/api/v1/blog", BlogRouter);
router.use('/api/v1/community', FaqRoutes);

// router.use("/api/v1/videocall",Videocallroutes);
export default router;