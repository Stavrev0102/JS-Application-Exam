const router = require('express').Router();
const animalManager = require('../managers/animalManager');

router.get('/',async(req,res) => {
    const animals = await animalManager.getAll().lean();
    const lastThree = animals.slice(-3)
  
    res.render('home', {lastThree} )
});
router.get('/search',async(req,res) => {
    // const { search } = req.query;

    // const animals = await animalManager.getAll(search);
    // console.log(animals)

    res.render('search')
})

router.get('/404',(req,res) => {
    res.render('404')
});


module.exports = router