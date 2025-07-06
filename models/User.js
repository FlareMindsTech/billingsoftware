import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    userName:{
type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    firstName: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
    //   minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      unique: true 
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    unique: true 
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"], 
    },
    role:{
        type: String,
  enum: ["Owner", "Admin"],
  required: true
    },
    status:{
        type:Boolean,
        required: true,
        default:true
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
