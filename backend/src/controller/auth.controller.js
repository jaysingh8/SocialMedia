const userModel = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
 
 async function registerController(req, res)  {
    const { username, email, password, bio, profile } = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserExist) {
        return res.status(409).json({
            message: "User already exist " +
                (isUserExist.email === email
                    ? "Email already exists"
                    : "Username already exists")
        })
    }

    const hash = await bcryptjs.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profile,
    })

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "Register Successful",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profile: user.profile
        }
    })
}
 
 async function loginController (req, res) {
    const { email, username, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            {
                email: email
            }, {
                username: username
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "user is not exist"
        })
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "password is incorrect"
        })
    }

    const token = jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    )

    res.cookie("token", token)

    res.status(201).json(
        {
            message: "login successfull",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profile: user.profile
            }
        }
    )
}
module.exports = {registerController , loginController}