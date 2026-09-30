const router = require("express").Router()
const Order = require('../models/order')
const Product = require('../models/product')
const isSignedIn = require('../middleware/is-signed-in')




//add order 

router.get("/new",isSignedIn,async(req,res)=>{
    
    const products=await Product.find();
    res.render("order/add-order.ejs",{
        products
    })
})
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

router.get("/",isSignedIn,async(req,res)=>{
    const orders=await Order.find({
        customer:req.session.user._id
    })
    .populate("customer")
    .populate("products");

    res.render("order/orders.ejs",{
        orders
    });
});



//read one order 


router.get('/:orderId',isSignedIn, async (req, res) => {
    const foundOrder= await Order.findById(
       req.params.orderId)
       .populate("customer")
       .populate("products")

       if(!foundOrder){
        return res.send("Order not found")
       }

       if(foundOrder.customer._id.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to view this order");
    }

       res.render("order/order-details.ejs",{
        order:foundOrder
       });
    
});


//edit order

router.get('/:orderId/edit',isSignedIn, async (req, res) => {
    const foundOrder = await Order.findById(req.params.orderId);

    if (!foundOrder) {
        return res.send('Order not found');
    }

    if(foundOrder.customer.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this order");

    }

    res.render("order/edit-order.ejs",{
        order:foundOrder
    });

});

//update order

router.put('/:orderId',isSignedIn, async (req, res) => {

    const foundOrder = await Order.findById(req.params.orderId);

    if (!foundOrder) {
        return res.send('Order not found');
    }

    if(foundOrder.customer.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to edit this order");

    }


    await Order.findByIdAndUpdate(
        req.params.orderId,
        {
            status:req.body.status
        }
    );
    res.redirect('/orders')
});


// delete order 

router.delete("/:orderId",isSignedIn,async(req,res)=>{
    const foundOrder=await Order.findById(req.params.orderId);

    if(!foundOrder){
        return res.send("order not found");
    }

    if(foundOrder.customer.toString()!== req.session.user._id.toString()){
        return res.status(403).send("You are not allowed to delete this order");

    }

    await Order.findByIdAndDelete(req.params.orderId);
       
    res.redirect("/orders");
    });

module.exports = router;




