const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    image: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    reviews: [
        {
            user: {type: Schema.Types.ObjectId, ref: 'User'},
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
