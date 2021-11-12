const usersModel  = require('../models/Users')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//register new user
exports.register = async(req, res)=>{
    const hashedPassword = bcrypt.hashSync(req.body.password, 9)
    obj = { 
       fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        admin: false
    }
    try{
      let user = await usersModel.create(obj)
      res.status(200).send({status:"ok", message:user})
   }catch(error){
      res.status(500).send({status:"bad", error: "Not Registered!"})
   } 
    
 }
 
 //login user
 exports.login = async (req, res) => {
   const user = await usersModel.findOne({ username: req.body.username });
   if (user) {
     value = await bcrypt.compare(req.body.password, user.password);
     if (value) {
       objUser = {
         username: user.username,
         email: user.email,
         admin: user.admin,
       };
       const genTok = jwt.sign({ user: objUser }, "suppersecret", {
         expiresIn: "5h",
       });

       res.cookie("token", genTok);
       res.status(200).send({status:"ok", message:user})

     } else res.status(401).send({status:"bad",error: "Invalid username or password!"});
   } else res.status(401).send({status:"bad", error: "Invalid username or password!"});
 };

 //get logged in user
 exports.getUser = async (req, res)=>{
   const user = await usersModel.findOne({ _id: req.params.id });
   if (user) {
      res.status(200).send({status:"ok", message:user})
   }else{
      res.status(500).send({status:"bad", error: "Not Found user!"})
   }
 }
 
 //resets the cookies and user info back
 exports.logout = (req,res)=>{
    req.cookies.token = undefined
    res.send({status:"logged out"})
 }


exports.home = async(req,res)=>{ 
   res.status(200).send("Welcome to IL SPESA LISTA!")
}

//add item to shopping list - shopping list is a sub-document of users document 
exports.addToShoppingList = async (req, res)=>{
   if(req.body.itemName == "" || req.body.storeFrom == ""){
      res.status(500).send({status:"bad", error: "Not added, Please Try again!"})
   }else{
      try{
         if (req.body.quantity == "") req.body.quantity = 1
         await usersModel.updateOne({_id: req.params.id}, {$push:{ "shoppingList": req.body } });
         await usersModel.updateOne({_id: req.params.id},{$addToSet: { category: "Default" } } );
           res.status(200).send({status:"ok"})
        }catch(error){
           console.log(error)
           res.status(500).send({status:"bad", error: "Not added, Please Try again!"})
        }
   }
    
}

//edit item in shopping list - shopping list is a sub-document of users document 
exports.editFromShoppingList = async (req, res)=>{
    try{
        await usersModel.updateOne({_id: req.params.id,  "shoppingList._id" :req.body.id }, {$set:{"shoppingList.$":req.body}})
        res.status(200).send({status:"ok"})
     }catch(error){
      res.status(500).send({status:"bad", error: "Not edited, Please Try again!"})
     }
}

//edit item in grocery Inventory- shopping list is a sub-document of users document 
exports.editGroceryInventory = async (req, res)=>{
   try{
       await usersModel.updateOne({_id: req.params.id,  "groceryInventory._id" :req.body.id }, {$set:{"groceryInventory.$":req.body}})
       res.status(200).send({status:"ok"})
    }catch(error){
     res.status(500).send({status:"bad", error: "Not edited, Please Try again!"})
    }
}

//delete item to shopping list - shopping list is a sub-document of users document 
exports.deleteFromShoppingList = async (req, res)=>{
    try{
      const isDeleted  = await usersModel.updateOne({ _id: req.params.id},{$pull : { "shoppingList" : {"_id":req.body.id} } } )
      res.status(200).send({status:"ok"})
     }catch(error){
        res.status(500).send({status:"bad", error: error})
     }
}


//delete item to grocery inventory - shopping list is a sub-document of users document 
exports.deleteFromGrocery = async (req, res)=>{
   try{
     const isDeleted  = await usersModel.updateOne({ _id: req.params.id},{$pull : { "groceryInventory" : {"_id":req.body.id} } } )
     res.status(200).send({status:"ok"})
    }catch(error){
       res.status(500).send({status:"bad", error: error})
    }
}

//On Done move the item in the shopping list to grocery inventory with cost and expiration date included
exports.done = async (req, res)=>{
   try{
      let user = await usersModel.findOne({"shoppingList._id" : req.body.id}, {"shoppingList.$" : 1, "_id" : 0})
      let body = {
         itemName: user.shoppingList[0].itemName,
         storeFrom: user.shoppingList[0].storeFrom,
         quantity: user.shoppingList[0].quantity,
         cost: req.body.cost,
         expirationData: req.body.expirationData
      }
      //Call the expense function here to calculate the overall expenses
      await usersModel.updateOne({_id: req.params.id}, {$push:{ "groceryInventory": body} });
      await usersModel.updateOne({ _id: req.params.id},{$pull : { "shoppingList" : {"_id":req.body.id} } } )
      res.status(200).send({status:"ok"})
      // res.status(200).send({success: "Item Successfully included to grocery Inventory!"})
   }catch(error){
      res.status(500).send({error: error})
   }
}

//to be restock - store the item back to shopping list so it can be restocked
exports.toBeRestocked = async (req, res)=>{
   try{
      let user = await usersModel.findOne({"groceryInventory._id" : req.body.id}, {"groceryInventory.$" : 1, "_id" : 0})
      let body = {
         itemName: user.groceryInventory[0].itemName,
         storeFrom: user.groceryInventory[0].storeFrom,
         quantity: user.groceryInventory[0].quantity,
      }
      await usersModel.updateOne({_id: req.params.id}, {$push:{ "shoppingList": body} });
      await usersModel.updateOne({ _id: req.params.id},{$pull : { "groceryInventory" : {"_id":req.body.id} } } )
      res.status(200).send({status:"ok"})
   }catch(error){
      res.status(500).send({status:"bad", error: error})
   }
}



//auto restock - directly order the item from the store and update the item inside grocery
// inventory 