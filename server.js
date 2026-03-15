const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/contact");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log("Mongo Error ❌",err));

// Test Route
app.get("/",(req,res)=>{
  res.send("Portfolio Backend Running 🚀");
});

// CONTACT API
app.post("/api/contact",async(req,res)=>{
  try{

    const {name,email,message} = req.body;

    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    res.status(201).json({
      message:"Message Saved Successfully ✅"
    });

  }catch(error){

    console.log("API ERROR:",error);

    res.status(500).json({
      error:"Internal Server Error"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});
