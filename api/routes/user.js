const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user_controller')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/user');
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


router.get('/',UserController.get_all_user);

router.post('/singup',upload.single('userProfileImg'),UserController.post_singup_user);

router.post('/login',UserController.post_login_user);

router.get('/:userId' ,UserController.get_user_byid );

router.patch('/:userId' ,UserController.update_user );

router.delete("/:userId",UserController.delete_user );

module.exports=router;