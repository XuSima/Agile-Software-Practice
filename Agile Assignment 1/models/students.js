var mongoose = require("mongoose")
var Schema = mongoose.Schema
mongoose.connect("mongodb://localhost/project")


let StudentSchema = new Schema({
    name: String,
    age: Number,
    gender:{
        type:Number,
        enum:[0,1],
        default:0
    },
    grade: Number,
    performance: {
        type:String,
        enum:[0,1],
        default:1
    },
    hobbies: String,
    upvotes: {type: Number, default: 0}
})

module.exports = mongoose.model("Student", StudentSchema)



