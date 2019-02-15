const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //document structure & rules defined here
    fullName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    encryptedPassword: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    },
    ingredients: [{ type: String, match: /[^A-Z]+/ }],
    cocktailCreated: {
      type: Array,
      items: { type: Schema.Types.ObjectId, ref: "Cocktail" }
    },
    cocktailFavorites: {
      type: Array,
      items: { type: Schema.Types.ObjectId, ref: "Cocktail" }
    }
  },
  {
    // additional settings for the Schema class defined here
    timestamps: true
  }
);
//"User" model => "users collection"
const User = mongoose.model("User", userSchema);

module.exports = User;
