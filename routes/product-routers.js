const router = require("express").Router()
const Product = require('../models/product')
const Store=require('../models/store')
const isSignedIn = require('../middleware/is-signed-in')


//add product 
router.get("/new",isSignedIn,async(req,res)=>{
    const stores=await Store.find({
        owner:req.session.user._id,
        isDeleted:false
    });
    res.render("product/add-product.ejs",{
        stores
    });
});
//create Product

router.post("/",isSignedIn, async (req, res) => {

    const foundStore=await Store.findOne({
        _id:req.body.store,
        owner:req.session.user._id,
        isDeleted:false
    });

    if(!foundStore){
        return res.status(403).send("You are not allowed to add a product to this store");
    }
    const createdProduct=await Product.create({
       name:req.body.name,
       description:req.body.description,
       price:req.body.price,
       image:req.body.image,
       store:req.body.store
    });
    res.redirect("/products");
});

//read all products



router.get("/",async(req,res)=>{
    const products=await Product.find().populate({
        path:"store",
        populate:{
            path:"owner"
        }
    });

    res.render("product/product.ejs",{
        products
    });
});


//read one product

router.get('/:productId', async (req, res) => {
    const foundProduct= await Product.findById(
       req.params.productId).populate("store")


       if(!foundProduct){
        return res.send("Product not found")
       }

       res.render("product/product-details.ejs",{
        product:foundProduct
       });
    
});

//edit product

router.get("/:productId/edit",isSignedIn, async (req, res) => {
    const foundProduct = await Product.findById(req.params.productId);


    if (!foundProduct) {
        return res.send('Product not found');
    }

    const foundStore= await Store.findById(foundProduct.store);
    
    if(!foundStore){
        return res.send("Store not found")
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this product");
    }
    

    const stores=await Store.find({
        owner:req.session.user._id,
        isDeleted:false
    });

    res.render("product/edit-product.ejs",{
        product:foundProduct,
        stores
    });

});
   
//update product

router.put('/:productId',isSignedIn, async (req, res) => {
   const foundProduct= await Product.findById(req.params.productId);
    
    if(!foundProduct){
        return res.send("Product not found")
    }

    const foundStore=await Store.findById(foundProduct.store);

    if(!foundStore){
        return res.send("Store not found")
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this product");
    }
    
   
   
    const {
         name, 
         description,
         price,
          image,
        store
             } = req.body;

   await Product.findByIdAndUpdate(req.params.productId, {
        name,
        description,
        price,
        image,
        store
   }
);
       
    

    res.redirect('/products')
});



// Delete product

router.delete("/:productId",isSignedIn,async(req,res)=>{
    const foundProduct=await Product.findById(req.params.productId);

    if(!foundProduct){
        return res.send("Product not found");
    }

    const foundStore=await Store.findById(foundProduct.store);


     if(!foundStore){
        return res.send("Store not found");
    }

    if(foundStore.owner.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to delete this product");
    }


    await Product.findByIdAndDelete(req.params.productId);
       
    res.redirect("/products");
    });

module.exports = router;

