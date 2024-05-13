const mongoose = require("mongoose");


//create schema
const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

//compile Post model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;