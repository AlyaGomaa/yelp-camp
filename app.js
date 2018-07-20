require('dotenv').config();

var express= require("express"),
     app= express(),
     request= require("request"),
     bodyParser = require("body-parser"),
     mongoose=require("mongoose"),
     passport=require("passport"),
     LocalStrategy=require("passport-local"),
     User =require("./models/user"),
     Campground = require("./models/campgrounds.js"),
     Comment = require("./models/comments.js"),
     seedDB = require("./seed.js"),
     flash =require("connect-flash"),
     methodOverride=require("method-override"),
     NodeGeocoder=require("node-geocoder");
     
// image upload configuration

     
    var multer = require('multer');
    var storage = multer.diskStorage({
      filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
      }
    });
    var imageFilter = function (req, file, cb) {
        // accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };
    var upload = multer({ storage: storage, fileFilter: imageFilter});
    
    var cloudinary = require('cloudinary');
        cloudinary.config({ 
      cloud_name: 'alyagomaa', 
      api_key: 915254884499594, 
      api_secret: "sy3SSpNKficbZ1LxCK6RNy-pqLE"
    });
 // google maps config
    var options = {
      provider: 'google',
      httpAdapter: 'https',
      apiKey: process.env.GEOCODER_API_KEY,
      formatter: null
    };
    var geocoder = NodeGeocoder(options);
    mongoose.connect("mongodb://localhost/yelp_camp");
    
//SEED THE DATABASE
/*seedDB();
*/
app.use(flash());
app.locals.moment = require('moment');


// PASSPORT CONFIG
 app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 


// adding sth to the db

/*Campground.create(
            {description:"This is a beautiful campground with natur all around it and some other text",name:"Big Cove YMCA",image:"http://www.lake-grapevine.com/wp-content/uploads/2010/10/Meadowmere-Park-Camping-small.jpg"}

,function(err,campground){
    
    if(err){
        console.log("Sth went wrong!");
    } else{
        console.log("new campground added!");
        console.log(campground);
    }
});*/


//some lorem ipsum

/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.*/

/* var campgrounds=[
        {name:"Acorn Oaks",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Wilderness_Adventure_Camps.jpg/800px-Wilderness_Adventure_Camps.jpg"},
        {name:"Atwood Lake",image:"https://res.cloudinary.com/simplotel/image/upload/x_0,y_0,w_2592,h_1458,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/youreka/Camp-Kambre_hcemsr"},
        {name:"Beaver Point",image:"http://cdn.skim.gs/image/upload/c_fill,dpr_1.0,f_auto,fl_lossy,q_auto,w_940/v1456338674/msi/summer-camp_frhitu.jpg"},
        {name:"Big Fisn-N",image:"https://img.sunset02.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/image/2016/10/main/hoodview-campground-0510.jpg?itok=xo0RuR6u"},
        {name:"Big Cove YMCA",image:"http://www.lake-grapevine.com/wp-content/uploads/2010/10/Meadowmere-Park-Camping-small.jpg"},
        {name:"Camp Becket",image:"http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg"},
        {name:"Camp Dudley",image:"https://www.planetware.com/photos-large/USUT/utah-zion-national-park-camping-south-campground.jpg"},
        {name:"Camp Hazen",image:"http://www.buffaloolmstedparks.org/wp-content/uploads/2018/01/1-3.jpg"},
        
        ];*/
        
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(function(req,res,next){
   res.locals.currentUser =req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
    
});

// LANDINGPAGE ROUTE
app.get("/",function(req,res){
    res.render("landingpage");
});
 
// INDEX ROUTE

app.get("/campgrounds", function(req,res){
    
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search),"gi");
         //get the campgrounds from our db
           Campground.find({name:regex},function(err,Campgrounds){
               if(err){
                   console.log("sth went wrong!"); // de law ml2ash el search query
               }else{ // de law l2ah
                    res.render("campgrounds",{campgrounds:Campgrounds,currentUser:req.user});
               }
               
           }) ;
    }else{ // law mafesh search query
      //get the campgrounds from our db
   Campground.find({},function(err,Campgrounds){
       if(err){
           console.log("sth went wrong!");
           
       }else{
            res.render("campgrounds",{campgrounds:Campgrounds,currentUser:req.user});
       }
       
   }) ;   
    }
   
   
    
});

// NEW CAMPGROUND ROUTE
 app.get("/campgrounds/new",isLoggedIn,function(req,res){
     
     res.render("new");
     
 });
 
 
// CREATE NEW CAMPGROUND ROUTE
app.post("/campgrounds",isLoggedIn,upload.single('image'),function(req,res){
 cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the campground object under image property
    
    req.body.image = result.secure_url;
    req.body.imageId = result.public_id;

    //get data from form and add to campgrounds array
    var campName = req.body.campName;
    var image = req.body.image;
    var campPrice = req.body.campPrice;
    
    var campDescription = req.body.campDescription;
    var campAuthor = req.user.username;
    var campAuthorId = req.user._id;
    var authorDetails = {id:campAuthorId,name:campAuthor};
    //geocoderr
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid Location');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var object = {name:campName,image:image,description:campDescription,author:authorDetails,price:campPrice,location: location, lat: lat, lng: lng,imageId:req.body.imageId};
        // add a campground to our db
        Campground.create(object,function(err,Campgroundss){
             if(err){
                 console.log(err);
                 
             }else{
                 // redirect back to campgrounds
                 res.redirect("/campgrounds");
             }
             
        });
    });
 });

});

// SHOW ROUTE
app.get("/campgrounds/:id",function(req,res){
    // getting the id from the user //mngher el populate exec can elcomments:ids msh mo7twa elcomment
   Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
        console.log(err);
    }else{
    // redirecting the useer to the show.ejs page
    
    res.render("show",{campground:foundCampground});
    
    }
});
    
});
// more info route
app.get("/campgrounds/moreinfo/:id",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       } else{
           res.render("moreInfo",{campground:campground});
       }
    });
   
});

//============
//COMMENTS ROUTES
//============


// NEW COMMENT ROUTE

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){console.log(err);}else{
          res.render("newComment",{campground:campground});  
        }
    }
    ) ;
});


// POST A NEW COMMENT ROUTE

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
         }else{
                Comment.create(req.body.comment,function(err,comment){
                   if(err){
                       req.flash("error","Something went wrong!");
                       console.log(err);
                       
                   }else{
                       // associate the user with the comment
                       comment.author.id=req.user._id;
                       comment.author.username =req.user.username;
                       comment.save();
                       //add comment to campground
                       campground.comments.push(comment);
                       campground.save();
                        req.flash("success","Comment successfully added.");
                       res.redirect("/campgrounds/"+ campground._id);
                    }
                });
            }
    });
});

//============  
// AUTH ROUTES
//============

//REGISTER ROUTES

app.get("/register",function(req, res) {
    res.render("register");
});

app.post("/register",upload.single('avatar'),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
    // add cloudinary url for the image to the campground object under image property
if(err){console.log(err);}
    req.body.avatar = result.secure_url;
    req.body.imageId = result.public_id;
     
       User.register(new User({username:req.body.username,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            country:req.body.country,
            gender:req.body.gender,
            avatar:req.body.avatar,
            imageId:req.body.imageId
       }),req.body.password,function(err,user){
           if(err){
               console.log(err);
               req.flash("error","User validation failed: All fields are required");
               return res.redirect("/register");
               
           }
               passport.authenticate("local")(req,res,function(){ //logging the user in after registering
                  req.flash("success","Successfully Registered");
                  res.redirect("/campgrounds"); 
               });
           
       });
    });
});
// LOGIN ROUTES

    app.get("/login",function(req, res) {
       res.render("login"); 
    });
    
    app.post("/login", passport.authenticate("local",{
            successRedirect:"/campgrounds",
            failureRedirect:"/login"
        }),function(req,res){
    });

//LOGOUT ROUTE

app.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Successfully logged out");
   res.redirect("/campgrounds");
});
// User Profile's routes
app.get("/users/:id",function(req, res) {
    User.findById(req.params.id,function(err,user){
        if(err){
            req.flash("error","User not found.");
            res.redirect("back");
        } else{
            Campground.find().where('author.id').equals(user._id).exec(function(err,campgrounds){
                if(err){
                    console.log(err);
                }else{
                    res.render("userProfile",{user:user,campgrounds:campgrounds});
                }
            });
           
        }
    });
});
//============
// Edit And Update Campgrounds
//============

app.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req, res) {
    
         Campground.findById(req.params.id,function(err,campground){
             if(err){console.log(err);}
                res.render("editCampground",{campground:campground}); 
        });
});
        

app.put("/campgrounds/:id",checkCampgroundOwnership,upload.single('image'),function(req,res){
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                req.flash("error","Campground not found.");
                console.log(err);
                res.redirect("back");
            } else { // hynzl hena b3d mayla2y elcampground
                console.log(campground);
                geocoder.geocode(req.body.location, function (err, data) {
                    if (err || !data.length) {
                      req.flash('error', 'Invalid Location');
                      return res.redirect('back');
                    }
                
                    if(req.file){ 
                        cloudinary.v2.uploader.destroy(campground.imageId,function(err){
                            if(err){
                               req.flash("error","Campground not found.");
                                console.log(err);
                                return res.redirect("back"); 
                            }else{
                                cloudinary.v2.uploader.upload(req.file.path,function(err,result){
                                    if(err){
                                        req.flash("error","Campground not found.");
                                        console.log(err);
                                    }else{
                                        
                                        campground.imageId=result.public_id;
                                        campground.image = result.secure_url;
                                        campground.name=req.body.campName;
                                        
                                        campground.description=req.body.campDescription;
                                        campground.location=data[0].formattedAddress,
                                        campground.lat= data[0].latitude,
                                        campground.lng= data[0].longitude;
                                        console.log("IMAGE SUCCESSFULLY UPLOADEDDD");
                                        
                                        campground.save();
                                        req.flash("success","Successfully Updated.");
                                        res.redirect("/campgrounds/"+campground._id);
                                                                         
                                        
                                    }
                                });//nhayet el upload
                                
                            }
                            
                        }); //nhayet eldestroy
                    } // de nhayet if bta3et elsora lama ttla3y mnhena yb2a mafesh sora
                       
                    
                    if(!req.file){
                        campground.name=req.body.campName;
                        
                        campground.description=req.body.campDescription;
                        campground.location=data[0].formattedAddress;
                        campground.lat= data[0].latitude;
                        campground.lng= data[0].longitude;
                        campground.save();
                        req.flash("success","Successfully Updated.");
                        res.redirect("/campgrounds/"+campground._id);
                    }
                    
            
                }); // bta3et geocoder
            }
    }); // bta3et findbyid
    
}); // bta3et app.put

// DESTROY ROUTE
app.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           console.log(err);
       }
       res.redirect("/campgrounds");
   }) ;
});



//============
// Edit And Update COMMENTss
//============

app.get("/campgrounds/:id/:commentid/edit",checkCommentOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.commentid,function(err,foundComment){
                if(err){
                    console.log(err);
                }else{
                   res.render("editcomment",{campground:foundCampground,comment:foundComment});
                }
            });
        }
    });
});

app.put("/campgrounds/:id/:commentid",checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){console.log(err);}else{
            Comment.findByIdAndUpdate(req.params.commentid,req.body.comment,function(err){
                if(err){console.log(err);}else{
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
        }
    });
   
});
// DELETE COMMENT
app.delete("/campgrounds/:id/:commentid",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.commentid,function(err){
        if(err){console.log(err);}else{
            req.flash("success","Comment successfully deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


// MIDDLEWARE

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","Please log in first");
        res.redirect("/login");
    }
}

function checkCampgroundOwnership(req,res,next){
     
    if(req.isAuthenticated()){
        //he is logged in but we dont know yet iff he owns the cg
         Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Campground Not Found!");
            res.redirect("back");
        }else{
            // we need to check if hes the owner
            if(req.user._id.equals(campground.author.id)){
                next();
            }else{
                req.flash("error","Permission Denied");
                res.redirect("back");
            }
        }
        });
    }else{ //hes not logged in
        req.flash("error","Please Log In First");
        res.redirect("back");
    }
}
 
 function checkCommentOwnership(req,res,next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.commentid,function(err,comment){
            if(err){console.log(err);}else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","Permission Denied");
                    res.redirect("login");
                }
            } 
         });
     }else{
         req.flash("error","Please Login First!");
         res.redirect("/login");
     }
     
 }
 
 function escapeRegex(text){
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
// listen route
app.listen(process.env.PORT, process.env.IP,function(){console.log("server is running rn!")});