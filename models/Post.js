const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    video: {
        type: String,
    },
     verified: {
         type: Boolean,
         default: true
     },
    tempvid: {
        type: String,
        required:false
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    video_id: {
        type: String
    },
    discription: {
        type: String
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);
