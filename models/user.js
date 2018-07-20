var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:{type:String,required: true},password:String,
    avatar:String,imageID:String, firstName:{type:String,required: true}, lastName:{type:String,required: true},email:{type:String,required: true},gender:{type:String,required: true},country:{type:String,required: true}
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);