var mongoose = require("mongoose")
var Schema = mongoose.Schema
mongoose.connect("mongodb://localhost/project")

let TeacherSchema = new Schema({
    name: String,
    age: Number,
    gender:{
        type:Number,
        enum:[0,1],
        default:0
    },
    grade: Number,
    rank: {
        type:Number,
        enum:[0,1,2],
        default:0
    },
    hobbies: String,
    upvotes:{type:Number,
        default:0}
})

module.exports = mongoose.model("Teacher", TeacherSchema)