import { Schema, model } from "mongoose";

const FaqSchema = Schema({
    question: {
        type: String,
        required: true,
    },
    answer: [{
        type: Schema.Types.ObjectId,
        required: false,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true,
    },
}, { timestamps: true });

const Faq = model('Faq', FaqSchema);

export default Faq;