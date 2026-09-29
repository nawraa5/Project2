const router = require("express").Router();
const Store= require('../models/store');
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

// read all stores

router.get('/', async (req, res) => {
    const stores = await Store.find({ 
        isDeleted: false 

    });
    res.render('stores', { stores});
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

    res.render("store-details.ejs", {
        store:foundStore
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

    res.render("edit-store",{
        store:foundStore
    });

});
   
//update store

router.put('/:storeId',isSignedIn, async (req, res) => {
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
        category,
       
    });

    res.redirect('/stores')
});



// Delete store 

router.delete("/:storeId",isSignedIn,async(req,res)=>{
    const foundStore=await Store.findById(req.params.storeId);

    if(!foundStore){
        return res.send("Store not found");
    }

    await Store.findByIdAndUpdate(req.params.storeId,{
        isDeleted:true
    });

    res.redirect("store/stores")


});

module.exports = router;