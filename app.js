const express = require('express');
const app = express();
const morgan = require('morgan');

const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const userRouter = require('./routes/user');
require("./db/connection");
require("dotenv").config();

app.use(morgan('dev'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/products',productRouter);
app.use('/orders',orderRouter);
app.use('/user',userRouter);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
   res.status(error.status || 500);
   res.json({
       error:{
           messsage:error.messsage
       }
   });
});


app.listen(3000,()=>{
    console.log(`server is running at :3000`);
})