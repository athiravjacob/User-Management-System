const express = require('express')
const admin_route = express()
const session = require('express-session')
const { v4: uuidv4 } = require('uuid'); 

admin_route.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const bodyParser = require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

const adminController = require('../controllers/adminController')
const auth = require('../middleware/adminAuth')

admin_route.get('/',auth.isLogout,auth.clearCache,adminController.loadAdminLogin)
admin_route.get('/login',auth.isLogout,auth.clearCache,adminController.loadAdminLogin)
admin_route.post('/login',adminController.verifyAdmin)
admin_route.get('/home',auth.isLogin,auth.clearCache,adminController.adminHome)
admin_route.get('/logout',auth.isLogin,auth.clearCache,adminController.adminLogout)
admin_route.get('/dashboard',auth.isLogin,auth.clearCache,adminController.dashboard)
admin_route.get('/viewAdmin',auth.isLogin,auth.clearCache,adminController.viewAdmin)

admin_route.get('/addUser',auth.isLogin,auth.clearCache,adminController.loadAddUser)
admin_route.post('/addUser',adminController.addUser)
admin_route.get('/editUser',auth.isLogin,auth.clearCache,adminController.editUserLoad)
admin_route.post('/editUser',adminController.editUser)
admin_route.get('/deleteUser',auth.isLogin,auth.clearCache,adminController.deleteUser)



admin_route.get('*',function(req,res){
    res.redirect('/admin')
})


module.exports = admin_route