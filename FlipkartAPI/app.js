let express = require('express');
let app = express();
let port = process.env.PORT||9120;
let Mongo = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect,getData,postData,} = require('./Controller/dbController')

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

app.get('/',(req,res) => {
    res.send('Hiii From express')
})

// get all categories
app.get('/category',async (req,res)=>{
    let query = {};
    let collection = "category"
    let output = await getData(collection,query)
    res.send(output)
})

//get all productTypes
app.get('/productType', async (req,res) => {
    let query = {};
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/categories', async(req,res) => {
    let query = {}
    if(req.query.stateId && req.query.mealId){
        query={category_id: Number(req.query.categoryId),"productTypes.producttype_id": Number(req.query.mealId)}
    }
    else if(req.query.productIdId){
        query={product_id: Number(req.query.productId)}
    }
    else if(req.query.mealId){
        query={"productTypes.productstype_id": Number(req.query.orderId)}
    }
    else{
        query = {}
    }
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/filter/:productId', async(req,res) => {
    let mealId = Number(req.params.productIdId);
    let cuisineId = Number(req.query.productIdId)
    let lcost = Number(req.query.lcost)
    let hcost = Number(req.query.hcost)
    if(productIdId){
        query = {
            "categoryTypes.categorytype_id":productId,
            "productId.product_id":cuisineId
        }
    } else if(lcost && hcost){
        query = {
            "categoryTypes.categorytype_id":categoryId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {}
    }
    let collection = "categories";
    let output = await getData(collection,query);
    res.send(output)
})

// details
app.get('/details/:id', async(req,res) => {
    let id = new Mongo.ObjectId(req.params.id)
    let query = {_id:id}
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/product/:id',async(req,res) => {
    let id = Number(req.params.id);
    let query = {product_id:id};
    let collection = "category";
    let output = await getData(collection,query);
    res.send(output)
})

//orders
app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})


//placeOrder
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})


app.post('/productDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {categoryId_id:{$in:req.body.id}};
        let collection = 'products';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
})

//update
app.put('/updateOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

//delete order
app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})


app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})