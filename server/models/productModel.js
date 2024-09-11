const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    image: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    category: {type: String, enum: ['hot', 'latest', 'featured'], required: true},
    reviews: [
        {
            user: {type: String},
            comment: {type: String, required: true},
            rating: {type: Number, required: true, min: 1, max: 5}
        }
    ]
    },{
        timestamps: true
    }
)
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
