const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const TravelController = require('../controllers/travel_controller');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/travel');
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

router.get('/',TravelController.get_all_travel);

router.post('/' , upload.single('sharedImg'), checkAuth ,TravelController.post_travel);

router.get('/:travelId' , TravelController.get_travel_byid);

router.patch('/:travelId' , checkAuth, TravelController.update_travel);

router.delete('/:travelId' , checkAuth, TravelController.delete_travel);

module.exports=router;