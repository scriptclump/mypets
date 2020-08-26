const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contentSchema = new Schema({
    title: {
       type: String,
       required: true
    },
    metaTitle: {
        type: String,
        required: true
     }, 
    metaKeyword: {
        type: String,
        required: true
    }, 
    metaDesc: {
        type: String,
        required: true
    }, 
    excepts: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, 
    status: {
        type: Integer,
        required: true
    },  
}, {
    timestamps: true
});

var Contents = mongoose.model('Contents', contentSchema);
module.exports = {Contents, contentSchema};