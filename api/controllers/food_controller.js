const mongoose = require('mongoose');
const Food = require('../models/food_model');

exports.food_get_all = (req,res,next)=>{
    Food.find()
    .select("-__v")
    .exec()
    .then(docs=>{
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.food_post = (req,res,next)=>{
    const food = new Food({
        _id:new mongoose.Types.ObjectId(),
        sharedDate:req.body.sharedDate,
        sharedLat:req.body.sharedLat,
        sharedLong:req.body.sharedLong,
        sharedText:req.body.sharedText,
        sharedUserId:req.body.sharedUserId,
        sharedUserName:req.body.sharedUserName,
        sharedUserProfileImg:req.body.sharedUserProfileImg,
        sharedImg:process.env.URL+'/'+req.file.path
    });
    food.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'food was created',
            createdFood:{
                _id:result._id,
                sharedDate:result.sharedDate,
                sharedLat:result.sharedLat,
                sharedLong:result.sharedLong,
                sharedText:result.sharedText,
                sharedUserId:result.sharedUserId,
                sharedUserName:result.sharedUserName,
                sharedUserProfileImg:result.sharedUserProfileImg,
                request:{
                    type:"GET",
                    url:process.env.URL+'/food/'+result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.food_get_byid = (req,res,next)=>{
    const id = req.params.foodId;
    Food.findById(id)
    .select('-__v')
    .exec()
    .then(doc=>{
        console.log("From Database", doc);
        if(doc){
            res.status(200).json({
                food:doc,
                request:{
                    type:'GET',
                    url:process.env.URL+"/food"
                }
            });
        }else{
            res.status(404).json({message:"No valid entry found for provided ID"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.food_update=(req,res,next)=>{
    const id = req.params.foodId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Food.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Food Updated',
            request:{
                type:'GET',
                url:process.env.URL+"/food/"+id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:err
        });
    });
}

exports.food_delete = (req,res,next)=>{
    const id = req.params.foodId;
    Food.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json({
            message:"Food deleted",
            request:{
                type:'POST',
                url:process.env.URL+'/food',
                body:{
                    sharedDate:'String',sharedLat:'String',sharedLong:'String',sharedText:'String',sharedUserId:'String',sharedUserName:'String',sharedUserProfileImg:'String'
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}