import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
     email:{
        type: String,
        required: true,
        unique: true, 
        format: {
            with: /^\S+@\S+\.\S+$/,
            message: 'Please enter a valid email address'
        }  
     },
     password: {
        type: String,
        required: true,
        minlength: 6,
     },
      assistantName: {
        type: String,
       
      },
      assistantImage: {
        type: String,
      },
      history: {
        type: Array,
        default: []
      },
      
},  { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;