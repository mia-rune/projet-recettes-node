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
        res.status(500).json({ error: error.message });
    }
});

//GET BY ID
recipeRouter.get("/recipes/:id", async (req, res) => {
    try {
        const recipe = await recipeModel.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: "Recette non trouvée" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//POST avec upload d'image
recipeRouter.post("/recipes", upload.single('image'), async (req, res) => {
    try {
        const recipeData = req.body;
        
        // Conversion des chaînes en tableaux pour les ingrédients
        if (typeof recipeData.ingredients === 'string') {
            recipeData.ingredients = [recipeData.ingredients];
        }
        
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
        const recipeId = req.params.id;
        const updateData = req.body;
        
        console.log('ID reçu:', recipeId);
        console.log('Données reçues:', updateData);
        
        // Vérifier que la recette existe
        const existingRecipe = await recipeModel.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ error: "Recette non trouvée" });
        }
        
        // Effectuer la mise à jour
        const updatedRecipe = await recipeModel.findByIdAndUpdate(
            recipeId, 
            updateData, 
            { 
                new: true, // Retourne la version mise à jour
                runValidators: true // Exécute les validations du modèle
            }
        );
        
        console.log('Recette mise à jour:', updatedRecipe);
        
        res.json({ 
            message: "Recette modifiée avec succès", 
            recipe: updatedRecipe 
        });
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(400).json({ error: error.message });
    }
})

//DELETE
recipeRouter.delete("/recipes/:id", async(req,res)=>{
    try {
        const recipeId = req.params.id;
        
        // Vérifier que la recette existe
        const existingRecipe = await recipeModel.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ error: "Recette non trouvée" });
        }
        
        await recipeModel.deleteOne({_id: recipeId});
        res.json({ message: "Recette supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = recipeRouter;