const router = require("express").Router();
const Stores = require('../models/store');
const isSignedIn = require('../middleware/is-signed-in');



router.post("/",isSignedIn ,async (req, res) => {
    const createdstore = await Store.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        owner: req.session.user._id
    })
    res.redirect("/stores")
})


router.get('/', async (req, res) => {
    const stores = await store.find({ isDeleted: false })
    res.render('store.ejs', { stores})
})

router.get('/:storesId', async (req, res) => {
    const foundStore = await store.findOne({ _id: req.params.storesId, isDeleted: false }).populate('owner')
    res.render('stores', { stores: foundStore })
})

router.delete('/:storesId', isSignedIn, async (req, res) => {
    const foundstore = await store.findById(req.params.storesId)
    if (!foundstore) {
        return res.send('Store not found')
    }
    

    const deletedstore = await store.findByIdAndUpdate(req.params.storesId, { isDeleted: true })
   

   res.redirect('/stores')

})

router.get('/:storesId/edit', async (req, res) => {
    const foundstores = await store.findById(req.params.storesId)
    res.render('stores', { stores: foundstores })
})

router.put('/:storesId', async (req, res) => {
    const { name, description, image, category, owner } = req.body
    const updatedstore = await store.findByIdAndUpdate(req.params.storeId, {
        name,
        description,
        image,
        category,
        owner
    })
    res.redirect('/stores')
})

module.exports = router;