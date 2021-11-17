const express = require('express')
const router = express.Router()
const routeHelper = require('../controllers/userController')

router.route('/')
.get(routeHelper.home)

router.route('/login')
.post(routeHelper.login)

router.route('/getUser/:id')
.get(routeHelper.getUser)

router.route('/register')
.post(routeHelper.register)

router.route('/logout')
.get(routeHelper.logout)


router.route('/addToShoppingList/:id')
.post(routeHelper.addToShoppingList)

router.route('/editFromShoppingList/:id')
.post(routeHelper.editFromShoppingList)

router.route('/editFromGroceryInventory/:id')
.post(routeHelper.editGroceryInventory)

router.route('/deleteFromShoppingList/:id')
.post(routeHelper.deleteFromShoppingList)

router.route('/deleteFromGrocery/:id')
.post(routeHelper.deleteFromGrocery)

router.route('/done/:id')
.post(routeHelper.done)

router.route('/toBeRestocked/:id')
.post(routeHelper.toBeRestocked)

router.route('/updateItemCategory/:id')
.post(routeHelper.updateItemCategory)

router.route('/updateCategory/:id')
.post(routeHelper.updateCategory)

router.route('/editMenuTitle/:id')
.post(routeHelper.editMenuTitle)


module.exports = router;