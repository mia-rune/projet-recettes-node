const recipeRouter = require('express').Router();
const recipeModel = require('../models/recipeModel');
const upload = require('../middleware/uploads')

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

//POST avec upload d'image
recipeRouter.post("/recipes", upload.single('image'), async (req, res) => {
    try {
        const recipeData = req.body;
        if (req.file) {
            recipeData.image = req.file.filename;
        }
        const newRecipe = new recipeModel(recipeData);
        await newRecipe.save()
        res.status(201).json({ message: "La recette a été ajoutée avec succès", recipe: newRecipe });
    } catch (error) {
        if (req.multerError) {
            return res.status(400).json({ error: "Format d'image non supporté" });
        }
        res.status(400).json({ error: error.message });
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