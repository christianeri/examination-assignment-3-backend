
let users = require('../data/users.database')
const express = require('express')
const controller = express.Router()

controller.route('/').get((req, res) => {
     res.status(200).json(users)
})

module.exports = controller 