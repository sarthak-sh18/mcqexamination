var mongoose=require("mongoose");

var clangSchema= new mongoose.Schema({
question:String,
option1:String,
option2:String,
option3:String,
option4:String,
answer:String
});

module.exports=mongoose.model("Clang",clangSchema);   