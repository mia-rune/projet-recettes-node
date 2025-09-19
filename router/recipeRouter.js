const recipeRouter = require('express').Router();
const recipeModel = require('../models/recipeModel');

//GET avec recherche et filtres
recipeRouter.get("/recipes", async (req, res) => {
    try {
        const { search, category, difficulty } = req.query;
                let filter = {};
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // par catégorie
        if (category) {
            filter.category = category;
        }
        
        // par difficulté
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        
        const recipes = await recipeModel.find(filter);
        res.json(recipes);
    } catch (error) {
        res.send(error);
    }
});

//GET BY ID
recipeRouter.get("/recipes/:id", async (req, res) => {
    try {
        const recipe = await recipeModel.findById(req.params.id);
        res.json(recipe);
    } catch (error) {
        res.send(error);
    }
});

//POST
recipeRouter.post("/recipes", async (req, res) => {
    try {
        const newRecipe = new recipeModel(req.body);
        await newRecipe.save()
        res.send("La recette a été ajoutée avec succès")
    } catch (error) {
        res.send(error)
    }
})

//UPDATE
recipeRouter.put("/recipes/:id", async (req, res) => {
    try {
        await recipeModel.updateOne({_id: req.params.id}, req.body)
        res.send("Recette modifiée avec succès")
    } catch (error) {
        res.send(error)
    }
})

//DELETE
recipeRouter.delete("/recipes/:id", async(req,res)=>{
    try {
        await recipeModel.deleteOne({_id: req.params.id})
        res.send("Recette supprimée")
    } catch (error) {
        res.send(error)
    }
})

module.exports = recipeRouter;