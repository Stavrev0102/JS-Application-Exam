
const router = require('express').Router();
const {getErrorMessage} = require('../utils/errorHelpers');
const animalManager = require('../managers/animalManager');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/create',async(req,res) => {
    res.render('animals/create')
});

router.post('/create',async(req,res) => {
const animalData = {
        ...req.body,
        owner:req.user._id
        }
    try {
        await animalManager.create(animalData);
        res.redirect('/animals/catalog')
    } catch (error) {
        res.render('animals/create',{ error:getErrorMessage(error) })
    }
});

router.get('/catalog',async(req,res) => {
    try {
        const animals = await animalManager.getAll().lean();
        res.render('animals/catalog',{ animals })
    } catch (error) {
        res.render('animals/catalog',{ error:getErrorMessage(error) })
    }
   
});

router.get('/:animalId/details', async(req,res) => {
    const animalId = req.params.animalId;
    
    try {
        const animal = await animalManager.getById(animalId).lean();
        const isAuth = req.user;
        const isOwner = animal.owner._id == req.user?._id
       let isDonated = false;
        const donators = animal.donations
        const isHere = donators.find(x => x == req.user?._id)
       if(isHere){
        isDonated = true
       }
    
        res.render('animals/details',{ animal,isOwner,isAuth,isDonated })
    } catch (error) {
        res.render(`animals/details`,{ error:getErrorMessage(error) })
    }
});
router.get('/:animalId/delete',isAuth ,async(req,res) => {
        try {
            const animalId = req.params.animalId;
            await animalManager.delete(animalId);
            res.redirect('/animals/catalog')
        } catch (error) {
            res.render('animals/details',{error: getErrorMessage(error)})
        }
       

    
});

router.get('/:animalId/edit', async(req,res) => {
    const animal = await animalManager.getById(req.params.animalId).lean();
    res.render('animals/edit',{ animal })
});
router.post('/:animalId/edit',async(req,res) => {
    const animalData = req.body;
    
    const animalId = req.params.animalId;
    await animalManager.edit(animalId,animalData);
    res.redirect(`/animals/${animalId}/details`)
});

router.get('/:animalId/donation',async(req,res) => {
    const userId = req.user._id;

    const animalId = req.params.animalId
    const animal = await animalManager.getById(animalId);

    animal.donations.push(userId);
    await animal.save();
    res.redirect(`/animals/${animalId}/details`)
})

module.exports = router
