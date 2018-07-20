var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   imageId: String,
   price:String,
   location: String, lat: Number, lng: Number,
   description: String,
   createdAt:{
      type:Date,
      default:Date.now
   },
   author:{
      id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      name:String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});


module.exports = mongoose.model("Campground", campgroundSchema);
