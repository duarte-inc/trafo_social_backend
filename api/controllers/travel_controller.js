const mongoose = require('mongoose');
const Travel = require('../models/travel_model');

exports.get_all_travel = (req,res,next)=>{
    Travel.find()
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

exports.post_travel = (req,res,next)=>{
    const travel = new Travel({
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
    travel.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Travel was created',
            createdTravel:{
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
                    url:process.env.URL+'/travel/'+result._id
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

exports.get_travel_byid= (req,res,next)=>{
    const id = req.params.travelId;
    Travel.findById(id)
    .select('-__v')
    .exec()
    .then(doc=>{
        console.log("From Database", doc);
        if(doc){
            res.status(200).json({
                food:doc,
                request:{
                    type:'GET',
                    url:process.env.URL+"/travel"
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

exports.update_travel = (req,res,next)=>{
    const id = req.params.travelId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Travel.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Travel Updated',
            request:{
                type:'GET',
                url:process.env.URL+"/travel/"+id
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

exports.delete_travel = (req,res,next)=>{
    const id = req.params.travelId;
    Travel.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json({
            message:"Travel deleted",
            request:{
                type:'POST',
                url:process.env.URL+'/travel',
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