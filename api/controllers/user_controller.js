const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const mongoose = require('mongoose');

exports.get_all_user = (req,res,next)=>{
    User.find()
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

exports.post_singup_user = (req,res,next)=>{
    User.find({userEmail:req.body.userEmail}).exec().then(user=>{
        if(user.length >= 1){
            return res.status(409).json({
                message:"Mail exists"
            });
        }else{
            bycrpt.hash(req.body.userPass,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user = new User({
                        _id:new mongoose.Types.ObjectId(),
                        userBirth:req.body.userBirth,
                        userEmail:req.body.userEmail,
                        userGender:req.body.userGender,
                        userJob:req.body.userJob,
                        userName:req.body.userName,
                        userPass:hash,
                        userProfileImg:process.env.URL+'/'+req.file.path
                    });
                    user.save().then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'User was created'
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        }
    }).catch();
}

exports.post_login_user = (req,res,next)=>{
    User.find({userEmail:req.body.userEmail})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(404).json({
                message: "Auth failed, Email doesn\'t exist"
            });
        }
        bycrpt.compare(req.body.userPass,user[0].userPass,(err,result)=>{
            if(err){
                return res.status(404).json({
                    message: "Auth failed"
                });
            }
            if(result){
                const token = jwt.sign({
                    userEmail:user[0].userEmail,
                    userId:user[0]._id
                },
                process.env.JWT_SECRETKEY,
                {
                    expiresIn:"1h"
                }
                );
                return res.status(200).json({
                    message: "Auth successful",
                    token:token
                });
            }
            res.status(401).json({
                message: "Auth failed, password wrong"
            });
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.get_user_byid = (req,res,next)=>{
    const id = req.params.userId;
    User.findById(id)
    .select('-__v')
    .exec()
    .then(doc=>{
        console.log("From Database", doc);
        if(doc){
            res.status(200).json({
                user:doc,
                request:{
                    type:'GET',
                    url:process.env.URL+"/user"
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

exports.update_user = (req,res,next)=>{
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    User.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'User Updated',
            request:{
                type:'GET',
                url:process.env.URL+"/user/"+id
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

exports.delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }