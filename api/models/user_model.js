const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    userBirth :{type:String , require:true},
    userEmail:{type:String ,
         require:true,
         unique: true,
         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    userGender:{type:String , require:true},
    userJob:{type:String , require:true},
    userName: {type:String , require:true},
    userPass:{type:String,require:true},
    userProfileImg:{type:String,require:true}
});

module.exports = mongoose.model('User',userSchema);