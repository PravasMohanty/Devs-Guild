const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
dotenv.config();

const Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email and password are required');
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const existsuser = await User.findOne({ email });
        if (!existsuser) {
            console.log('User not found');
            return res.status(401).send("User not found")
        }
        const isPasswordValid = await bcrypt.compare(password, existsuser.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid Credentials")
        }

        const token = jwt.sign({
            id: existsuser._id,
            name: existsuser.name,
            email: existsuser.email,
            username: existsuser.username,
            dob: existsuser.dob
        },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        existsuser.password = undefined;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: existsuser._id,
                name: existsuser.name,
                email: existsuser.email,
                username: existsuser.username,
                dob: existsuser.dob
            }
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const Register = async (req, res) => {
    const { name, username, dob, email, password } = req.body;
    if (!name || !username || !dob || !email || !password) {
        console.log('All fields are required');
        return res.status(400).json({ error: `All fields are required` });
        // return res.status(400).json({ error: `All fields are required ${name} ${username} ${dob} ${email} ${password}` });

    }
    try {
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).send('User already exists');
        }
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            dob,
            email,
            password: hashedPass
        })

        await newUser.save();

        const regToken = jwt.sign({
            id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            dob: newUser.dob,
            email: newUser.email
        },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Successfully Registered',
            token: regToken,
            user: {
                name: newUser.name,
                username: newUser.username,
                dob: newUser.dob,
                email: newUser.email
            }
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const Onboard = async (req, res) => {
    try {
        const U_id = req.user.id;
        const { img } = req.body;

        if (!img) {
            return res.status(400).json({ message: "No avatar selected" });
        }

        const existsUser = await User.findById(U_id);

        if (!existsUser) {
            return res.status(404).json({ message: "User not found" });
        }
        existsUser.firstLogin = false;
        existsUser.avatar = img;

        await existsUser.save();

        res.status(200).json({ message: "Avatar Updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}

module.exports = {
    Login,
    Register,
    Onboard
}