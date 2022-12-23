const mongoose = require('mongoose')

const inventoryItemSchema = mongoose.Schema({
     id:{type:mongoose.Schema.Types.ObjectId},
     articleNumber:{type:String, required:true},
     name:{type:String, required:true}, 
     description:{type:String}, 
     category:{type:String}, 
     price:{type:Number, required:true}, 
     rating:{type:Number}, 
     imageName:{type:String}, 
     tag:{type:String} 
})

module.exports = mongoose.model("inventoryitems", inventoryItemSchema)