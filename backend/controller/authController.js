import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';


export const signUp = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if(password.length < 6){
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
         const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
          
        const token = await generateToken(newUser._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000, // 7 days
        });
    return res.status(201).json({ message: 'User created successfully' });
    

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Sign up error' });
    }

    }


    //login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure:true,
      sameSite:"none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

    //log out controller
    export const logout =  async (req, res) => {

        try {
            
            res.clearCookie('token');
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            
            return res.status(500).json({ message: 'Logout error' });
        }
    }

