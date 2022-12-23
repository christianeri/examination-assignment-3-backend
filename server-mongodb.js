
const mongoose = require('mongoose')

const initMongoDB = async () => {
     const dbConnection = await mongoose.connect(process.env.MONGODB_URI)
     console.log(`MongoDB is running at ${dbConnection.connection.host}`)
}

module.exports = initMongoDB