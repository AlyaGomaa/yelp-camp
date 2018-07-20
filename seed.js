var mongoose =require("mongoose");
var Campground =require("./models/campgrounds.js");
var Comment = require("./models/comments.js");
var data = [
    {name:"Acorn Oaks",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Wilderness_Adventure_Camps.jpg/800px-Wilderness_Adventure_Camps.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

},
    {name:"Atwood Lake",image:"https://res.cloudinary.com/simplotel/image/upload/x_0,y_0,w_2592,h_1458,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/youreka/Camp-Kambre_hcemsr",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

},
    {name:"Beaver Point",image:"http://cdn.skim.gs/image/upload/c_fill,dpr_1.0,f_auto,fl_lossy,q_auto,w_940/v1456338674/msi/summer-camp_frhitu.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

}
    ] // the starter or seed data for our app

function seedDB(){
Campground.remove({},function(err){
    if(err){console.log(err);
        
    }else{
        console.log("removed everything");}})}
     
// Create the three campgrounds (elseed data) 
//         data.forEach(function(seed){ // for each campground mel array
//             Campground.create(seed,function(err,createdSeed){
//                 if(err){
//                     console.log(err);
//                 } else{
//                     console.log("campground created!");
//                     // create a comment for each campground
//                     Comment.create({
//                         text:"Hellowwwwpw",
//                         author:"Alya"
//                     },function(err,comment){
//                         if(err){console.log(err);
                            
//                         }else{ // associate teh comments with the seed data
//                             createdSeed.comments.push(comment);
//                             createdSeed.save(function(err){
//                                 if(err){console.log(err); 
//                                  }else{
//                                     console.log("comment created!!");
//                                 }
//                             });
//                         }
//                     });
                    
//                 }
//             });  
//     }});
// }


// module.exports= seedDB;