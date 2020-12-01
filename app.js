const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Game = require('./models/game');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const WishList = require('./models/wishlist');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Game.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Game);
User.hasOne(Cart);
Cart.belongsToMany(Game, {through: CartItem });
Game.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Game, { through: OrderItem});

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        return User.findByPk(1);
        //console.log(result);
    })
    .then(user => {
        if(!user) {
            return User.create({ name: 'Christian', email: '123@gmail.com'});
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })