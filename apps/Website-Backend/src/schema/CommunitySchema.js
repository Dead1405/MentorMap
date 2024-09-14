import { Schema } from "mongoose";

const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        required: true,
    },
    posts: {
        type: [String],
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

const Community = mongoose.model("Community", CommunitySchema);

export default Community;