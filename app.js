const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//buraya route eklenecek
const foodRoutes = require('./api/routes/food');
const travelRoutes = require('./api/routes/travel');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://canberk:' + process.env.MONGO_ALTAS_PW + '@travelblogcluster.uysfy.mongodb.net/travelblog?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Controll-Allow-Origin','*');
    res.header('Access-Controll-Allow-Headers','Origin');
    if(req.method==='OPTIONS'){
        res.header('Access-Controll-Aloow-Methods','Put-Post-Patch-Delete,Get')
        return res.status(200).json({})
    }
    next();
});

//buraya travel gelcek
app.use('/food',foodRoutes);
app.use('/user',userRoutes);
app.use('/travel',travelRoutes);

app.use((req, res, next) => {
    const error = new Error('not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});


module.exports = app;