const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatSchema = Schema({
    name: { type: String, required: true },
    chats: { type: Array, default: null }
} , { timestamps : true });

module.exports = mongoose.model('Chat' , ChatSchema);