var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserDetailsSchema= new mongoose.Schema({
Member1:String,
Member2:String

});

UserDetailsSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("UserDetails",UserDetailsSchema);            