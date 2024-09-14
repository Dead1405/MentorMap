import { Router } from "express";
import { DeleteFaq, EditFaq, GetAllAnswersOfFaq, GetAllFaqs, GetFaqById, PostFaq, deleteAnswer, getUserFaqByuserId, postAnswerOfFaq } from "../controllers/Faq/Faqsection.js";
import verifyJWT from "../middlewares/Auth.middleware.js";
const FaqRoutes = Router();

// Setting up routes for Faq
FaqRoutes.get("/bulk", GetAllFaqs);
FaqRoutes.post("/post", verifyJWT , PostFaq);
FaqRoutes.get("/getbyid/:id", GetFaqById);
FaqRoutes.put('/editquestion/:id', verifyJWT , EditFaq)
FaqRoutes.delete('/delete/:id', verifyJWT , DeleteFaq);
FaqRoutes.get('/getuserquesiton', verifyJWT , getUserFaqByuserId);

//Setting up routes for answering Faq
FaqRoutes.post('/answerpost/:id', verifyJWT , postAnswerOfFaq);
FaqRoutes.get('/allansofques/:id', GetAllAnswersOfFaq);
FaqRoutes.delete('/answerdelete/:id', verifyJWT , deleteAnswer);

export default FaqRoutes;