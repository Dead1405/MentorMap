import { Schema, model } from "mongoose";

const FaqAnswerSchema = Schema({
    faq:{
        type: Schema.Types.ObjectId,
        ref: 'Faq',
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true,
    },
}, { timestamps: true });

const FaqAnswer = model('Faqanswer', FaqAnswerSchema);

export default FaqAnswer;