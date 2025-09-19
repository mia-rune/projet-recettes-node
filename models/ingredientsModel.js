// dans recipeModel, remplacer 'ingredients' par ceci:
// ingredients: [{
//     ingredient_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "ingredients",
//         required: [true, "L'ingrédient est requis"]
//     },
//     quantite: {
//         type: String,
//         required: [true, "La quantité est requise"],
//         trim: true
//     }
// }],

const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom de l'ingrédient est requis"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Le type d'ingrédient est requis"],
        enum: {
            values: ["fruit", "légume", "viande", "poisson", "céréale", "légumineuse", "produit laitier", "épice", "condiment", "autre"],
            message: "Le type doit être : fruit, légume, viande, poisson, céréale, légumineuse, produit laitier, épice, condiment ou autre"
        }
    }
});

const ingredientModel = mongoose.model("ingredients", ingredientSchema);

module.exports = ingredientModel;
