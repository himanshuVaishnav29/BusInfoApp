const mongoose=require("mongoose");

const busSchema=new mongoose.Schema({
    depot:{
        type:String,
        required:true,
    },
    source:{
        type:String,
        required:true,
    },
    via:{
        type:[String],
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    totalDistance:{
        type:Number,
    },
    busClass:{
        type:String,
        default:"Ordinary" 
    }
});

const BUSINFO=mongoose.model("busInfo",busSchema);
module.exports=BUSINFO;