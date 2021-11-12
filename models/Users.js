const mongoose = require('mongoose');



const shoppingListSchema =  mongoose.Schema({
    itemName:{
        type: String,
        required: true,
    },
    storeFrom:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    },
    category:{
        type: String,
        default: "Default"
    }
})


const groceryInventorySchema =  mongoose.Schema({
    itemName:{
        type: String,
        required: true,
    },
    storeFrom:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        default:1
    }, 
    expirationData:{
        type: Date,
    },
    cost:{
        type: Number
    },
    category:{
        type: String,
        default: "Default"
    }
})

const usersSchema =  mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    },
    shoppingList:{
        type: [shoppingListSchema],
        default: null
    },
    groceryInventory:{
        type: [groceryInventorySchema],
        default: null
    },
    category:[{
        type: String
    }]
})
const usersModel = mongoose.model('usersModel', usersSchema,'users')
module.exports = usersModel