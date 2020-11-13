const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const userSchema = new schema({
    name: String,
    email: String,
    password: String,
    cart: {type: schema.Types.ObjectId, ref: 'cartSchema'},
    isAdmin: { type: Boolean, default: false },
    image: { data: Buffer, contentType: String },
    online: Boolean
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
        { type: schema.Types.ObjectId, ref: 'productSchema'}
    ],
    date: {type: Date, default: Date.now}
});

const chatSchema = new schema({
    from: { type: schema.Types.ObjectId, ref: 'userSchema'},
    to: [{type: schema.Types.ObjectId, ref: 'userSchema'}],
    content: String,
    date: {type: Date, default: Date.now},
})

const credit = new schema({});

const historySchema= new schema({
    owner: { type: schema.Types.ObjectId, ref: 'userSchema'},
    products: [
        { type: schema.Types.ObjectId, ref: 'productSchema'}
    ],
    date: {type: Date, default: Date.now},
    totalPrice: Number
});

historySchema.plugin(deepPopulate);
productSchema.plugin(deepPopulate)
categorySchema.plugin(deepPopulate);

module.exports.userSchema = mongoose.model('userSchema', userSchema)
module.exports.productSchema = mongoose.model('productSchema', productSchema);
module.exports.categorySchema = mongoose.model('categorySchema', categorySchema);
module.exports.cartSchema = mongoose.model('cartSchema', cartSchema);
module.exports.credits = mongoose.model('credits', credit);
module.exports.chatSchema = mongoose.model('chatSchema', chatSchema);
module.exports.historySchema = mongoose.model('historySchema', historySchema);