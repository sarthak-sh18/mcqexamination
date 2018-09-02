var express = require("express");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var passportLocalMongoose = require("passport-local-mongoose");
var methodoverride = require("method-override");
var User = require("./models/user");
var UserDetails=require("./models/userdetails");
var Clang=require("./models/clang");
var java=require("./models/java");
app.use(methodoverride("_method"));
mongoose.Promise = global.Promise;


mongoose.connect("mongodb://localhost/restrout",{useMongoClient:true});
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret:"logintomysite",
    resave:false,
    saveUninitialized:false
}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.get("/",function(req,res){
    res.render("index.ejs",{newuser:req.user});
});


app.post("/",function(req,res){
    var newUser = new User({member1:req.body.member1,member2:req.body.member2,username:req.body.username,score:0,attempt:0,lan:"Not Participated"});  // Username = teamname

    User.register(newUser,req.body.password,function(error,user){
        if(error){
            console.log(error);
            res.render("userexists.ejs");
        }
        else{
            passport.authenticate("local")(req,res,function(){
               newUser.save(function(error){
        if(error){
            console.log(error);
            
        }
        else{
            console.log(newUser);
            
        }
    });
          res.redirect("/rules")});  
        }
    });
});


app.post("/javaedit",function(req,res){

  res.render("javaedit.ejs",{newuser:req.user});
});

app.get("/scorejava",function(req,res){
    res.render("scorejava.ejs",{newuser:req.user});
});
app.get("/scorec",function(req,res){
    res.render("scorec.ejs",{newuser:req.user});
});


app.get("/login",function(req,res){
    res.render("login.ejs",{newuser:req.user});
});


app.post("/login",passport.authenticate("local",{
    successRedirect:"/rules",
    failureRedirect:"/login"
}),function(req,res){
});



app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});



app.get("/rules",isLoggedIn,function(req,res){
    res.render("rules.ejs",{newuser:req.user});
});

app.get("/admin",isLoggedIn,function(req,res){
    res.render("admin.ejs",{newuser:req.user});
});

app.get("/c",isLoggedIn,function(req,res){
    res.render("c.ejs",{newuser:req.user});
});

app.get("/java",isLoggedIn,function(req,res){
    
    res.render("java.ejs",{newuser:req.user});
  
});


app.get("/questions/c",isLoggedIn1,function(req,res){
    res.render("cquestion.ejs",{newuser:req.user});
});

app.post("/questions/c",function(req,res){
   
   console.log(req.body);
   console.log("====================");
  
  
   Clang.create(req.body.cquestion,function(error,newcquestion){
       
       if(error){
           console.log(error);
           res.send(error);
       }
       else
       {
           res.redirect("/questions/c");
       }
   });
});

app.get("/questions/java",isLoggedIn1,function(req,res){
    res.render("javaquestion.ejs",{newuser:req.user});
});

app.post("/questions/java",isLoggedIn1,function(req,res){
   
   console.log(req.body);
   console.log("====================");
  
  
   java.create(req.body.javaques,function(error,newquestion){
       
       if(error){
           res.send(error);
       }
       else
       {
           res.redirect("/questions/java");
       }
   });
});

// app.post("/score",function(req,res){
//     req.body;
//     var i=0;
//     var j=1;
//     var ans;
//     var score=0;
    
    
//     i=i-1;
//     Object.keys(java).forEach(function(answer){
//         console.log("ho")
//         i++;
//         console.log()
//         ans[i]=java[answer];
//     })
//     console.log(req.body);
//     console.log(req.body.choice1);
//     console.log("Hi from outside");
//     console.log("i="+i);
//     console.log("j="+j);
//     for(j=1;j<=i;j++){
//         console.log("Hi");
//         if(req.body.choice[j]===ans[j]){
//             console.log("hi from if");
//             score++;
//         }
//         else{
//             console.log(req.body.choice[j]);
//             console.log("Hi from else");
//         }
//     }
    
//     res.render("score.ejs",{score:score,newuser:req.user});
    
// });

app.get("/users",isLoggedIn1,function(req,res){
  User.find({},function(error,users){
      if(error){
          console.log("******Error******");
      }
      else{
          res.render("registered.ejs",{users:users});
      }
  });
    
});

app.post("/scorejava",isLoggedIn,function(req,res){
    var score=0;
    
    
  java.find({},function(error,javaf){
      if(error){
          console.log("******Error******");
      }
      else{
          var j=0;
          javaf.forEach(function(javas){
               
               if(req.body.choice[j]===javas.answer){
                   score++;
               }
               else{
                   
               }
               j++;
               
          });  
         var user=req.user;
         user.score=score;
         user.lan="java";
          user.attempt=1;
          res.render("scorejava.ejs",{score:score,newuser:req.user});
          user.save(function(error){
              if(error){
                  console.log(error)
              }
              else{
                  
                console.log(req.user)
                
              }
          })
          
          
      }
  });
  
});

app.post("/scorec",isLoggedIn,function(req,res){
    var score=0;
    
    
  Clang.find({},function(error,cf){
      if(error){
          console.log("******Error******");
      }
      else{
          var j=0;
          cf.forEach(function(clangs){
               
               if(req.body.choice[j]===clangs.answer){
                   score++;
               }
               else{
                   
               }
               j++;
               
          });  
          var user=req.user;
          user.score=score;
          user.lan="C";
          user.attempt=1;

          res.render("scorec.ejs",{score:score,newuser:req.user});
          user.save(function(error){
              if(error){
                  console.log(error)
              }
              else{
                  
                console.log(req.user);
                
              }
          })
          
      }
  });
  
});


app.get("/questions/java/display",isLoggedIn,function(req,res){
  java.find({},function(error,javaf){
      if(error){
          console.log("******Error******");
      }
      else if(req.user.attempt===1&&req.user.username!='interface'){
          res.render("alparticipated.ejs",{newuser:req.user});
      }
      else{
          res.render("javadisp.ejs",{newuser:req.user,java:javaf});
      }
  });
});

app.get("/questions/c/display",isLoggedIn,function(req,res){
  Clang.find({},function(error,cf){
      if(error){
          console.log("******Error******");
      }
      else if(req.user.attempt==1&&req.user.username!='interface'){
          res.render("alparticipated.ejs",{newuser:req.user});
      }
      else{
          
          res.render("cdisp.ejs",{newuser:req.user,cf:cf});
      }
  });
});
app.get("*",function(req,res){
    res.send("PAGE NOT FOUND");
});

// app.get("/questions/java/display",function(req,res){
//     res.render("javadisp.ejs",{newuser:req.user,java:java})
// })


function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    else{
        res.redirect("/login");
    }
}

function isLoggedIn1(req,res,next){
    if(req.isAuthenticated())
    {
        if(req.user.username==="interface"){
        return next();
        }
        else{
            res.send("PAGE NOT FOUND");
        }
            
        }
    else{
        res.redirect("/login");
    }
}
app.listen(3000,function(){
    console.log("Server Started at port 3000");
});