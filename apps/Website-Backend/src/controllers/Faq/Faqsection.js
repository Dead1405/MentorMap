import FaqAnswer from '../../schema/FaqAnswerSchema.js';
import Faq from '../../schema/FaqSchema.js';
import Apiresponse from '../../utils/ApiResponse.js';
import AsyncHandler from '../../utils/AsyncHandle.js';

const GetAllFaqs = AsyncHandler(async (req, res) => {
    const faqs = await Faq.find().populate('createdBy', 'username avatar _id');
    return res.status(200).json(new Apiresponse(200, faqs, "All FAQs"));
});


const PostFaq = AsyncHandler(async (req, res) => {
    const { question } = req.body;
    const faq = await Faq.create(
        {
            question,
            createdBy: req.user._id,
        }
    );
    return res.status(201).json(new Apiresponse(201, faq, "Faq Created"));
});

const UpdateFaq = AsyncHandler(async (req, res) => {
    const { question } = req.body;
    const faq = await Faq.findById(req.params.id);
    if (req.user._id !== faq.createdBy.toString()) {
        return res.status(401).json(new Apiresponse(401, null, "Not Authorized"));
    }
    if (!faq) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Not Found"));
    }
    faq.question = question;
    await faq.save();
    return res.status(200).json(new Apiresponse(200, faq, "Faq Updated"));
});

const DeleteFaq = AsyncHandler(async (req, res) => {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Not Found"));
    }
    if (req.user._id.toString() !== faq.createdBy.toString()) {
        return res.status(401).json(new Apiresponse(401, null, "Not Authorized"));
    }
    const removeFaq = await Faq.findByIdAndDelete(req.params.id);
    //remove all answers of this faq
    await FaqAnswer.deleteMany({ faq: req.params.id });
    return res.status(200).json(new Apiresponse(200, null, "Faq Deleted"));
});

const EditFaq = AsyncHandler(async (req, res) => {
    const { question } = req.body;
    const faq = await Faq.findById(req.params.id);
    console.log(faq.createdBy.toString(), req.user._id.toString());
    if (faq.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json(new Apiresponse(401, null, "Not Authorized"));
    }
    const response = await Faq.findByIdAndUpdate(req.params.id, { question: question }, { new: true });
    if (!faq) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Not Found"));
    }
    return res.status(200).json(new Apiresponse(200, response, "Updated"))
})

const getUserFaqByuserId = AsyncHandler(async (req, res) => {
    const faqs = await Faq.find({ createdBy: req.user._id }).populate('createdBy', 'username avatar');
    return res.status(200).json(new Apiresponse(200, faqs, "All FAQs"));
})

const GetFaqById = AsyncHandler(async (req, res) => {
    const faq = await Faq.findById(req.params.id).populate('createdBy', 'avatar username');
    if (!faq) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Not Found"));
    }
    return res.status(200).json(new Apiresponse(200, faq, "Faq"));
});

const postAnswerOfFaq = AsyncHandler(async (req, res) => {
    const { answer } = req.body;
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Not Found"));
    }
    const faqAnswer = await FaqAnswer.create(
        {
            content: answer,
            faq: req.params.id,
            createdBy: req.user._id,
        }
    );
    const postAnswer = await Faq.findByIdAndUpdate(faq._id, {
        $push: {
            answer: faqAnswer._id
        }
    });
    return res.status(201).json(new Apiresponse(201, faqAnswer, "Faq Answer Created"));
});

const deleteAnswer = AsyncHandler(async (req, res) => {
    const faqAnswer = await FaqAnswer.findById(req.params.id);
    if (!faqAnswer) {
        return res.status(404).json(new Apiresponse(404, null, "Faq Answer Not Found"));
    }
    if (req.user._id.toString() !== faqAnswer.createdBy.toString()) {
        return res.status(401).json(new Apiresponse(401, null, "Not Authorized"));
    }
    const removeFaqAnswer = await FaqAnswer.findByIdAndDelete(req.params.id);
    const deletedAnswer = await Faq.findByIdAndUpdate(faqAnswer.faq, {
        $pull: {
            answer: removeFaqAnswer._id
        }
    });
    return res.status(200).json(new Apiresponse(200, null, "Faq Answer Deleted"));
})

const GetAllAnswersOfFaq = AsyncHandler(async (req, res) => {
    const faqAnswers = await FaqAnswer.find({ faq: req.params.id }).populate('createdBy', 'username avatar _id');
    return res.status(200).json(new Apiresponse(200, faqAnswers, "All Answers of FAQ"));
});

export {
    GetAllFaqs,
    PostFaq,
    UpdateFaq,
    DeleteFaq,
    GetFaqById,
    postAnswerOfFaq,
    GetAllAnswersOfFaq,
    EditFaq,
    getUserFaqByuserId,
    deleteAnswer
};