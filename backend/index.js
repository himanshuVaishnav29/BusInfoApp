const express=require("express");
const mongoose=require("mongoose");
const fs=require("fs");
const path=require("path");
const BUSINFO=require("./models/busInfoModel");
const app=express();
const cors=require("cors");
app.use(cors());

// app.use(express.static("."));
// app.use(express.static(__dirname));

// app.use(express.static("../client"));
app.use(express.static(path.join(__dirname, "../client")));

require("dotenv").config();  
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// app.set("view engine","ejs");
// app.set("views",path.resolve("./views"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log("Error connecting DB",err));


//RENDERING HOME PAGE
app.get("/",(req,res)=>{ 
    fs.readFile(path.join(__dirname, "../client/index.html"),"utf8",(err,data)=>{
        if(err)console.log("Error fetching index.html",err);
        else
        // res.setHeader({'content-type':'text/html'});
        res.send(data);
    })
});
let currentRequest=[];

// FINDING THE SOURCE AND DESTINATION
app.post("/getQueryResult",async (req,res)=>{
    let{source,destination}=req.body;
    source = new RegExp('^' + source + '$', 'i');
    destination = new RegExp('^' + destination + '$', 'i');
    console.log(source,destination);
    try{
        const srcAndDestinationMatch=await BUSINFO.find({
               $or:[
                    {source:source,destination:destination},
                    {source:source,via:destination}
               ] 
        }); 
        // console.log(srcAndDestinationMatch);
        // if(srcAndDestinationMatch.length==0){
        //     res.redirect("/");
        // }
        currentRequest=srcAndDestinationMatch;
        res.redirect("/");
    }
    catch{
        console.log("Error fetching result")
        res.json({msg:"Error fetching results"});
    }
}); 
   
// SENDING CURRENT REQ DATA TO FRONTEND
app.get("/getCurrentRequest",(req,res)=>{
    try{  
        res.json(currentRequest);
        currentRequest=[];
    }
    catch{
        res.json({msg:"error getting curr req"});
    }
})



// SENDING WHOLE DATA TO FRONT END FOR allSources and allDestinations Arrays
app.get("/getAllData",async (req,res)=>{
    try{
        const data=await BUSINFO.find({});
        res.json(data);
    } 
    catch{
        console.log("Error fetching all data");
    }
})

app.listen(3000,(err)=>{
    if(err)
    console.log("Error starting server");
    else{
        console.log(`Server listening at port 3000`);
    }
})