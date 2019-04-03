const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new schema({
    name: String,
    email: String,
    password: String,
    cart: {type: schema.Types.ObjectId, ref: 'cartSchema'},
    isAdmin: { type: Boolean, default: false }
});


userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next;
    }

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) {
            return next(err);
        }

        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = (pasword) => {
    return bcrypt.compareSync(pasword, this.password);
}


const productSchema = new schema({
    name: String,    
    price: Number,
    quantity: Number,
    expireIn: Date,
    imageUrl: String,
    dateAdd: {type: Date, default: Date.now},
    category: {type: schema.Types.ObjectId, ref: 'categorySchema'},
    addedBy: {type: schema.Types.ObjectId, ref: 'userSchema'}
});


const categorySchema = new schema({
    type: String
});

const cartSchema = new schema({
    owner: { type: schema.Types.ObjectId, ref: 'userSchema' },
    products: [
        { type: schema.Types.ObjectId, ref: 'productSchema',}
    ]
});


const credit = new schema({});

module.exports.userSchema = mongoose.model('userSchema', userSchema)
module.exports.productSchema = mongoose.model('productSchema', productSchema);
module.exports.categorySchema = mongoose.model('categorySchema', categorySchema);
module.exports.cartSchema = mongoose.model('cartSchema', cartSchema);
module.exports.credits = mongoose.model('credits', cartSchema);;