const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const menuSchema = new Schema({
    title: {
       type: String,
       required: true
    },
    contentUrl: {
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

var Menus = mongoose.model('Menus', menuSchema);
module.exports = {Menus, menuSchema};