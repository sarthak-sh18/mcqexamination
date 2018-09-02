var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var UserSchema= new mongoose.Schema({
member1:String,
member2:String,
username:String,
password:String,
score:Number,
attempt:Number,
lan:String

});
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);            