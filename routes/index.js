var express = require('express');
var router = express.Router();
const { Recipe } = require('../models');
const { check, validationResult } = require('express-validator');

router.use(express.json());

//async handler for this application
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send( { message: "Welcome to the API project"});
});

/**
 * Get all recipes (GET)
 */
router.get('/api/recipes', asyncHandler(async(req, res) => {
  try {
    //query's the DB for all instances and returns them
    const recipes = await Recipe.findAll({
      attributes: ['id', 'name', 'description', 'ingredient']
    })
      res.status(200)
      res.json({ recipes })
  } catch(error) {
      res.status(404)
      res.json({ error: "Items could not be found" })
  }
}));
 /**
 * Get a single recipe (GET)
 */
router.get('/api/recipes/:id', asyncHandler(async(req, res) => {
  try {
    //query's the DB for all instances and returns them
    const recipe = await Recipe.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'name', 'description', 'ingredient']
    });
    if(recipe) {
      res.status(200)
      res.json({ recipe })
    } else {
      res.status(404).json({
        message: "Recipe does not exist"
      })
    }
  } catch(error) {
      res.status(404)
      res.json({ error })
  }
}));
  /**
 * update a recipe (PUT)
 */
router.put('/api/recipes/:id', [
  check('name')
    .exists({ checkNull: true })
    .withMessage('Please provide a name'),
  check('description')
    .exists({ checkNull: true })
    .withMessage('Please provide a description'),
  check('ingredient')
    .exists({ checkNull: true })
    .withMessage('Please provide a list of Ingredients'),
],asyncHandler(async(req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() })
  }
  
  try {
    const curRecipe = await Recipe.findByPk(req.params.id)
    if(curRecipe){
      curRecipe.update(req.body)
      res.status(204).end();
    } else {
      res.status(404).json({
        message: "Recipe could not be found"
      })
    }
  } catch(error) {
    res.status(404)
    res.json({ error })
  }
}));
  /**
 * Create a new recipe (POST)
 */
router.post('/api/recipes', [
  check('name')
    .exists({ checkNull: true })
    .withMessage('Please provide a name'),
  check('description')
    .exists({ checkNull: true })
    .withMessage('Please provide a description'),
  check('ingredient')
    .exists({ checkNull: true })
    .withMessage('Please provide a list of Ingredients'),
], asyncHandler(async(req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    res.status(201)
    const recipe = await Recipe.create(req.body)
    res.location("/api/recipe/" + recipe.id).end();
  }catch(error) {
    res.status(400)
    res.json({ error })
  } 
}));
 /**
 * Delete a recipe (DELETE)
 */
router.delete('/api/recipes/:id', asyncHandler(async(req, res, next) =>{
  try{
    //find the recipe first
    const curRecipe = await Recipe.findByPk(req.params.id)
    //if found then delete it
      await curRecipe.destroy({
        where: {
            id: req.params.id
        }
      })
      res.status(204)
      res.json({
        message: "Recipe deleted!"
      })
  } catch(error) {
      res.status(400)
      res.json({ error })
  }
}));

module.exports = router;
