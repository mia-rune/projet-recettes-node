const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est requis"],
        match: /^[a-zA-ZÀ-ÿ0-9\s\-\.\,\:\!\?\'\"]+$/
    },

    description: {
        type: String,
        required: [true, "Une description est requise"]
    },

    ingredients: {
        type: [String],
        required: [true, "Les ingrédients sont requis"],
    },

    instructions: {
        type: String,
        required: [true, "Les instructions sont requises"]
    },

    prepTime: {
        type: Number,
        required: [true, "Le temps de préparation est requis"],
    },

    cookingTime: {
        type: Number,
        required: [true, "Le temps de cuisson est requis"],
    },

    difficulty: {
        type: String,
        required: [true, "La difficulté est requise"],
        enum: {
            values: ["facile", "moyen", "difficile"],
            message: "La difficulté doit être : facile, moyen ou difficile"
        }
    },

    category: {
        type: String,
        required: [true, "La catégorie est requise"],
        enum: {
            values: ["entrée", "plat principal", "dessert"],
            message: "La catégorie doit être : entrée, plat principal ou dessert"
        }
    },
});

const recipeModel = mongoose.model("recipes", recipeSchema);
module.exports = recipeModel