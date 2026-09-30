const router = require("express").Router();
const Store= require('../models/store');
const Product=require('../models/product')
const isSignedIn = require('../middleware/is-signed-in');





// crate store


router.post("/",isSignedIn ,async (req, res) => {
    const createdStore = await Store.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        owner: req.session.user._id
    });
    res.redirect("/stores")

});

router.get("/new",isSignedIn,async(req,res)=>{
    res.render("store/add-store.ejs")
});



//cakes stores
router.get('/cakes', async(req,res)=>{
    const stores= await Store.find({
        category:"cakes",
        isDeleted:false
    });
    res.render("cakes.ejs",{
        stores
});
});




// flowers store
router.get('/flowers', async(req,res)=>{
    const stores= await Store.find({
        category:"flowers",
        isDeleted:false
    });
    res.render("flowers.ejs",{
        stores
});
});


// read all stores

router.get('/', async (req, res) => {
    const stores = await Store.find({ 
        isDeleted: false 

    });
    res.render('store/stores.ejs', {
         stores
        });
});


//read one store

router.get('/:storeId', async (req, res) => {
    const foundStore = await Store.findOne({ 
        _id: req.params.storeId,
        isDeleted: false
     }).populate("owner");


    if (!foundStore) {
        return res.send('Store not found');
    }

    const products = await Product.find({
        store:req.params.storeId
    });

    res.render("store/store-details.ejs", {
        store:foundStore,
        products
    });
});


    
//edit store
router.get('/:storeId/edit',isSignedIn, async (req, res) => {
    const foundStore = await Store.findOne({
        _id: req.params.storeId,
        isDeleted:false
    });


    if (!foundStore) {
        return res.send('Store not found');
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this store");
    }

    res.render("store/edit-store.ejs",{
        store:foundStore
    });

});
   
//update store

router.put('/:storeId',isSignedIn, async (req, res) => {
    const foundStore= await Store.findById(req.params.storeId);
    
    if(!foundStore){
        return res.send("Store not found")
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this store");
    }
    

    const {
         name, 
         description,
          image,
           category
             } = req.body;

   await Store.findByIdAndUpdate(req.params.storeId, {
        name,
        description,
        image,
        category
       
    });

    res.redirect('/stores')
});



// Delete store 

router.delete("/:storeId",isSignedIn,async(req,res)=>{
    const foundStore=await Store.findById(req.params.storeId);

    if(!foundStore){
        return res.send("Store not found");
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to delete this store");
    }

    

    await Store.findByIdAndUpdate(req.params.storeId,{
        isDeleted:true
    });

    res.redirect("/stores")


});

module.exports = router;