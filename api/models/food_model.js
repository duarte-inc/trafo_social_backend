const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    sharedDate :{type:String , require:true},
    sharedImg:{type:String , require:true},
    sharedLat:{type:String , require:true},
    sharedLong:{type:String , require:true},
    sharedText: {type:String , require:true},
    sharedUserId:{type:String,require:true},
    sharedUserName: {type:String , require:true},
    sharedUserProfileImg: {type:String , require:true}
});

module.exports = mongoose.model('Food',foodSchema);