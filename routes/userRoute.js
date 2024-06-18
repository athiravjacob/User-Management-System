const express = require('express')
const user_route = express()
const session = require('express-session');
const { v4: uuidv4 } = require('uuid'); 

user_route.use(session({
    secret:uuidv4(),
    resave: false,
    saveUninitialized: true
}))

user_route.set('view engine','ejs')
user_route.set('views','./views/user')

const bodyParser = require('body-parser')
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))

const userController = require('../controllers/userController')
const auth = require('../middleware/auth')



user_route.get('/register',auth.isLogout,auth.clearCache,userController.loadRegister)
user_route.post('/register',userController.insertUser)
user_route.get('/',auth.isLogout,auth.clearCache,userController.loginLoad)
user_route.get('/login',auth.isLogout,auth.clearCache,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth.isLogin,auth.clearCache,userController.loadHome)
user_route.get('/logout',auth.isLogin,auth.clearCache,userController.userLogout)




module.exports = user_route