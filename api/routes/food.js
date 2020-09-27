const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const FoodController = require('../controllers/food_controller');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/food');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()*Math.floor(Math.random()*999) + file.originalname);
    }
});

const fileFilter =(req,file,cb)=>{
    //dosya jpeg png harıcıyse reddet reddet
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }    
};

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/',FoodController.food_get_all);

router.post('/' , upload.single('sharedImg'), checkAuth ,FoodController.food_post);

router.get('/:foodId' , FoodController.food_get_byid);

router.patch('/:foodId' , checkAuth, FoodController.food_update);

router.delete('/:foodId' , checkAuth, FoodController.food_delete);

module.exports=router;