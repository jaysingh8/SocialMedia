const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        unique:[true,'username is already exist'],
        required:[true,'username is require']
    },
    email:{
        type:String,
        unique:[true,'email is already exist'],
        required:[true,'email is require']
    },
    password:{
        type:String,
        required:[true,'password is require']
    },
    bio:String,
    profile:{
        type:String,
        default:"default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.webp"
    }
})
const userModel = mongoose.model('User',userSchema)

module.exports = userModel