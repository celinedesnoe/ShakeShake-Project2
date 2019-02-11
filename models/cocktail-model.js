const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cocktailSchema = new Schema(
  {
    strDrink: { type: String, required: true },
    dateModified: { type: Date },
    idDrink: { type: String },
    strAlcoholic: { type: String },
    strCategory: { type: String },
    strDrinkThumb: { type: String },
    strGlass: { type: String },
    strIBA: { type: String },
    strIngredient1: { type: String, required: true },
    strIngredient2: { type: String, required: true },
    strIngredient3: { type: String },
    strIngredient4: { type: String },
    strIngredient5: { type: String },
    strIngredient6: { type: String },
    strIngredient7: { type: String },
    strIngredient8: { type: String },
    strIngredient9: { type: String },
    strInstructions: { type: String, required: true },
    strMeasure1: { type: String, required: true },
    strMeasure2: { type: String, required: true },
    strMeasure3: { type: String },
    strMeasure4: { type: String },
    strMeasure5: { type: String },
    strMeasure6: { type: String },
    strMeasure7: { type: String },
    strMeasure8: { type: String },
    strMeasure9: { type: String },
    strIngredMeasure: { type: Array, items: Object }
  },
  { timestamps: true }
);

const Cocktail = mongoose.model("Cocktail", cocktailSchema, "cocktailList");
module.exports = Cocktail;
