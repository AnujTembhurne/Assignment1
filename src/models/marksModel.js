const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const marksSchema = new mongoose.Schema({
    studentsName :{
        type : String,
        required :true
    },
    subject : {
        type : String,
        required :true
    },
    marks : {
        type : Number,
        required :true
    },
    userId : { 
        type : ObjectId,
        ref : "user",
        required :true
    }
},{ timestamps : true })

module.exports = mongoose.model( 'marks' , marksSchema )