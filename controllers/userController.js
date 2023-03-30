import User from "../models/Users.js";
import Image from "../models/Images.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length < 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profileImg;
    if (req.files) {
      profileImg = await Image.create({
        filename: new Date().getTime() + " " + req.files.file.name,
        data: req.files.file.data,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profileImg: profileImg
        ? `http://localhost:8000/images/${profileImg.filename}`
        : profileImg,
    });

    if (profileImg) {
      await Image.findByIdAndUpdate(profileImg._id, {
        userId: newUser._id,
      });
    }

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body.password
          ? {
              ...req.body,
              password: await bcrypt.hash(req.body.password, 10),
            }
          : req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({
        success: true,
        data: deletedUser,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async(req, res)=> {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({
        success: false,
        message: "user doesn't exist, please log in"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "invalid password"
      })
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    res.header("token", token)
    res.status(200).json({
      success: true,
      data: user,
      token
    })

   
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser };
