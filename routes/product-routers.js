const router = require("express").Router()
const Product = require('../models/product')
const isSignedIn = require('../middleware/is-signed-in')



//create Product

router.post("/",isSignedIn, async (req, res) => {
    const createdProduct=await Product.create({
       name:req.body.name,
       description:req.body.description,
       price:req.body.price,
       image:req.body.image,
       store:req.body.store
    });
    res.redirect("/product");
});

//read all products

router.get("/",async(req,res)=>{
    const products=await Product.find().populate("store");

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

router.get('/:productId/edit',isSignedIn, async (req, res) => {
    const foundProduct = await Product.findById(req.params.productId);


    if (!foundProduct) {
        return res.send('Product not found');
    }

    res.render("product/edit-product.ejs",{
        product:foundProduct
    });

});
   
//update product

router.put('/:productId',isSignedIn, async (req, res) => {
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
       
    });

    res.redirect('/product')
});



// Delete product

router.delete("/:productId",isSignedIn,async(req,res)=>{
    const foundProduct=await Product.findById(req.params.productId);

    if(!foundProduct){
        return res.send("Product not found");
    }

    await Product.findByIdAndDelete(req.params.productId);
       
    res.redirect("/product");
    });

module.exports = router;

