const router = require("express").Router()
const Order = require('../models/order')
const isSignedIn = require('../middleware/is-signed-in')



//create order 

router.post("/",isSignedIn,async(req,res)=>{
    const createdOrder=await Order.create({
        customer:req.session.user._id,
        products:req.body.products,
        totalPrice:req.body.totalPrice,
        status:"Pending"

    })
    res.redirect("/orders")
})


//read all order 

router.get("/",async(req,res)=>{
    const orders=await Order.find()
    .populate("customer")
    .populate("products");

    res.render("orders.ejs",{
        orders
    });
});



//read one order 


router.get('/:orderId', async (req, res) => {
    const foundOrder= await Order.findById(
       req.params.orderId)
       .populate("customer")
       .populate("products")

       if(!foundOrder){
        return res.send("Order not found")
       }

       res.render("order-details.ejs",{
        order:foundProduct
       });
    
});


//edit order

router.get('/:orderId/edit',isSignedIn, async (req, res) => {
    const foundOeder = await Order.findById(req.params.orderId);

    if (!foundOeder) {
        return res.send('Order not found');
    }

    res.render("edit-Order.ejs",{
        order:foundOeder
    });

});

router.put('/:orderId',isSignedIn, async (req, res) => {
    const {
         customer, 
         products,
         totalPrice,
          status
             } = req.body;

   await Order.findByIdAndUpdate(req.params.orderId, {
        customer, 
         products,
         totalPrice,
          status
       
    });

    res.redirect('/orders')
});


// delete order 

router.delete("/:orderId",isSignedIn,async(req,res)=>{
    const foundOeder=await Order.findById(req.params.orderId);

    if(!foundOeder){
        return res.send("order not found");
    }

    await Order.findByIdAndDelete(req.params.orderId);
       
    res.redirect("/orders");
    });

module.exports = router;




