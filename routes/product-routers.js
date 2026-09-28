const router = require("express").Router()
const cake = require('../models/cake')
const isSignedIn = require('../middleware/is-signed-in')



router.post('/', async (req, res) => {
    const createdstore = await store.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        owner: req.session.user._id
    })
    res.redirect('/stores')
})


router.get('/', async (req, res) => {
    const cakes = await cake.find({ isDeleted: false })
    res.render('cakes.ejs', {cakes})
})

router.get('/:cakesId', async (req, res) => {
    const foundCake = await cake.findOne({ _id: req.params.cakesId, isDeleted: false }).populate('owner')
    res.render('cakes', { cakes: foundCake })
})

router.delete('/:cakesId', isSignedIn, async (req, res) => {
    const foundcake = await cake.findById(req.params.cakesId)
    if (!foundcake) {
        return res.send('Store not found')
    }
    

    const deletedcake = await cake.findByIdAndUpdate(req.params.cakesId, { isDeleted: true })
   

   res.redirect('/cakes')

})

router.get('/:cakesId/edit', async (req, res) => {
    const foundcakes = await cake.findById(req.params.cakesId)
    res.render('cakes', { cakes: foundcakes })
})

router.put('/:cakesId', async (req, res) => {
    const { name, description, image, category, owner } = req.body
    const updatedstore = await cake.findByIdAndUpdate(req.params.cakesId, {
        name,
        description,
        image,
        category,
        owner
    })
    res.redirect('/cakess')
})

module.exports = router;