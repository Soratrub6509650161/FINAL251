// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./ds');

const postRouter = require('./routes/post');
const storeRouter = require('./routes/store');
const loginRouter = require('./routes/login');
const cartRouter = require('./routes/cart');
const mycartRouter = require('./routes/mycart')
const comRouter = require('./routes/comments')
const proRouter = require('./routes/profile')
const buyRouter = require('./routes/buy')
const hisRouter = require('./routes/History')
const reviewRouter = require('./routes/reviews')
const RegisRouter = require('./routes/regis')
const productRouter = require('./routes/product')


app.use(express.json());
app.use(cors());

app.use("/post", postRouter);
app.use("/store", storeRouter);
app.use("/login", loginRouter); 
app.use("/cart",cartRouter);
app.use("/mycart",mycartRouter);
app.use("/comments",comRouter);
app.use("/profile",proRouter);
app.use("/buy",buyRouter);
app.use("/History",hisRouter);
app.use("/Reviews",reviewRouter);
app.use("/Signup",RegisRouter);
app.use("/product",productRouter);




app.listen(3001, () => {
    console.log("Server running on port 3001");
});
