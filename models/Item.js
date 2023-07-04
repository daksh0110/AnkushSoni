const mongoose=require("mongoose");
const ItemSchema=({
    user:String,
    password:String
   
});

const Item=new mongoose.model("Item",ItemSchema);

module.exports=Item;