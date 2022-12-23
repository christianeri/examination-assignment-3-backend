 
const express = require('express')
const controller = express.Router()
const inventoryItemSchema = require('../schemas/inventoryItemSchema') 




///////////////  unsecured routes /////////////// 

controller.route('/').get(async(req, res) => {
     try {
          const items = await inventoryItemSchema.find() 
          res.status(200).json(items)

     } catch {res.status(400).json()}
})





// fetch inventory items by tag Alt 1: (inaktivt) Enligt tutorial med _id som articleNumber.
// controller.route('/tag/:tag').get(async(req, res) => {
     
//      try {
//           const items = await inventoryItemSchema.find({tag: req.params.tag})
          
//           const list = []
//           if(items)
//           {
//                for(let item of items) {
//                     list.push({
//                          articleNumber: item.id,
//                          name: item.name,
//                          description: item.description,
//                          category: item.category,
//                          price: item.price,
//                          rating: item.rating,
//                          imageName: item.imageName,
//                          tag: item.tag
//                     })
//                }
//                res.status(200).json(list)
          
//           } else 
//                res.status(404).json()

//      } catch {res.status(404).json()}
// })

// fetch selected number of inventory items by tag Alt 2: (aktivt) 5-siffrigt articleNumber (string) tillagd som egen property i varje produktobjekt i databasen för enklare användarhantering i webappen.
controller.route('/tag/:tag/:take').get(async(req, res) => {
     
     try {
          if(req.params.take) {
               const items = await inventoryItemSchema.find({tag: req.params.tag}).limit(req.params.take)

               if(items)
                    res.status(200).json(items)
               else 
                    res.status(404).json()
          } else {
               const items = await inventoryItemSchema.find({tag: req.params.tag})
               
               if(items)
                    res.status(200).json(items)
               else 
                    res.status(404).json()
          }

     } catch {res.status(404).json()}
})





// fetch selected number of inventory items by category
controller.route('/category/:category/:take').get(async(req, res) => {
     
     try {
          if(req.params.take) {
               const items = await inventoryItemSchema.find({category: req.params.category}).limit(req.params.take)

               if(items)
                    res.status(200).json(items)
               else 
                    res.status(404).json()
          } else {
               const items = await inventoryItemSchema.find({category: req.params.category})
               
               if(items)
                    res.status(200).json(items)
               else 
                    res.status(404).json()
          }

     } catch {res.status(404).json()}
})





// fetch a selected number of randomized inventory items
controller.route('/items/:take').get(async(req, res) => {

     try {
          let array = await inventoryItemSchema.find()
          
          //https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj#comment-21icc
          function shuffle(array) {
               const newArray = [...array]
               const length = newArray.length
             
               for (let start = 0; start < length; start++) {
                 const randomPosition = Math.floor((newArray.length - start) * Math.random())
                 const randomItem = newArray.splice(randomPosition, 1)
             
                 newArray.push(...randomItem)
               }
          return newArray.slice(0, req.params.take)
          }

          res.status(200).json(shuffle(array))

     } catch {res.status(404).json()}
})






// fetch inventory item by article number
controller.route('/item/:articleNumber').get(async(req, res) => {
     try {
          // const items = await inventoryItemSchema.findById(req.params.articleNumber)
          const item = await inventoryItemSchema.findOne({articleNumber: req.params.articleNumber})
          if(item)
               res.status(200).json(item)
          else 
               res.status(404).json()

     } catch {res.status(404).json()}
})





//fetch a selected number of inventory items by by rating
controller.route('/rated/:rating/:take').get(async(req, res) => {
     try {
          const items = await inventoryItemSchema.find({rating: req.params.rating}).limit(req.params.take)
          
          if(items)
               res.status(200).json(items)
          else 
               res.status(404).json()

     } catch {res.status(404).json()}
})





controller.route('/related/:category/:articleNumber/:take').get(async(req, res) => {

     try {
          const sameCategoryItems = await inventoryItemSchema.find({category: req.params.category})
          const relatedItems = sameCategoryItems.filter(x => x.articleNumber != req.params.articleNumber)
          const result = relatedItems.slice(0, req.params.take)

          if(result)
               res.status(200).json(result)
          else 
               res.status(404).json()

     } catch {res.status(404).json()}

})





/////////////// (to be) secured routes ///////////////  

controller.route('/add').post(async(req, res)=> {
     
     const { articleNumber, name, description, category, price, rating, imageName, tag } = req.body

     if(!articleNumber || !name || !price)
          res.status(400).json({text: 'article number, name and price is required'})

     const itemExits = await inventoryItemSchema.findOne({articleNumber})
     if(itemExits)
          res.status(409).json({text: 'a product with this article number already exists in the database'})
     else {
          const newInventoryItem = await inventoryItemSchema.create({
               articleNumber, 
               name, 
               description, 
               category, 
               price, 
               rating,
               imageName, 
               tag 
          })
          if(newInventoryItem)
               res.status(201).json({text: `product ${newInventoryItem.articleNumber}(id:${newInventoryItem._id}) was created successfully`})
          else
               res.status(400).json({text: 'something went wrong when trying to create the new product'})
     }
})





controller.route('/edit/:id').put(async(req, res)=> {
     
     try {
     
          const item = await inventoryItemSchema.findByIdAndUpdate(req.params.id, req.body)
  
          if(item)
               res.status(201).json({text: `product ${item.articleNumber}(id:${item._id}) was updated successfully`})
          else
               res.status(400).json({text: 'something went wrong when trying to update the product'})

      } catch (error) {res.status(400).json(error.message)}
  })





controller.route('/remove/:articleNumber').delete(async(req, res)=> {
     
     const item = await inventoryItemSchema.findOne({articleNumber: req.params.articleNumber})
     
     if(!req.params.articleNumber) 
          res.status(400).json({text: 'article number not specified'})
     else {
          if(item) {
               await inventoryItemSchema.remove(item)
               res.status(200).json({text: `product ${req.params.articleNumber} was deleted successfully`})
          } else
               res.status(400).json({text: `something went wrong when trying to delete product ${req.params.articleNumber}`})
     }
})



module.exports = controller 
