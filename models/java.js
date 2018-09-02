var mongoose=require("mongoose");

var javaSchema= new mongoose.Schema({
	id:Number,
question:String,
option1:String,
option2:String,
option3:String,
option4:String,
answer:String
});

module.exports=mongoose.model("java",javaSchema);   