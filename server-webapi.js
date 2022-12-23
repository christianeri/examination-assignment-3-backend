require('dotenv').config()

const port = process.env.API_PORT || 5000
const initMongoDB = require('./server-mongodb')
const express = require('express') 
const app = express()


const cors = require('cors')
const bodyParser = require('body-parser')


// middlewares --------- system -> middleware -> app 

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())


// routes/controllers

const inventoryItemsController = require('./controllers/inventoryItemsController')
app.use('/api/inventoryitems', inventoryItemsController) 
// app.use('/api/inventoryitems', require('./controllers/inventoryItemsController')) 

const usersController = require('./controllers/usersController')
app.use('/api/users', usersController)


initMongoDB()
app.listen(port, () => console.log(`WebApi is running at http://localhost:${port}`))
