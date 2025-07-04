import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserSchema from "../models/User.js";
dotenv.config()
export const Register = async (req, res) => {
    const saltRound = 10;
    let { firstName, lastName, email, mobile, password } = req.body;
    let role = "Admin";
    const randomNum = Math.floor(100 + Math.random() * 900);
    let userName = `${firstName}${randomNum}`;

    const validateMobile = (mobile) => {
        const regex = /^[6-9]\d{9}$/;
        return regex.test(mobile);
    };
    if (!validateMobile(mobile)) {
        return res.status(400).json({
            message: "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9"
        });
    }
    let exemail = await UserSchema.findOne({ email: email });
    if (exemail) return res.status(400).json({ message: "Email already exists" });


    bcrypt.hash(password, saltRound, async (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        try {


            let register = await new UserSchema({
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                email: email,
                password: hash,
                role: role

            });

            let usersave = await register.save();
            res.status(201).json({ message: `${role} created successfully`, data: usersave });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};



export const login = async (req, res) => {
    console.log(req.body);
    if (!req.body.email && !req.body.mobile) {
        return res.status(400).json({ message: "Please enter email or mobile number" });
    }

    if (!req.body.password) {
        return res.status(400).json({ message: "Please enter password" });
    }
    let identifier = req.body.email?.toLowerCase() || req.body.mobile;
    let foundUser = await UserSchema.findOne({
        $or: [
            { email: identifier },
            { mobile: identifier },
        ]
    });


    if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
            if (result) {
                try {
                    const token = jwt.sign({ id: foundUser?._id }, process.env.JWT, {
                        expiresIn: "4h",
                    });
                    res.header("token", token).json({
                        message: "Login successfully",
                        token: token,
                    });
                } catch (error) {
                    res.status(400).json({ message: error.message });
                }
            } else {
                res.status(400).json({ message: "Please enter correct password" });
            }
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
