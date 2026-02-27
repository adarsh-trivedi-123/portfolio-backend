const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Contact = require("./models/contact");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log("Mongo Error ❌",err));


/* =========================
   Test Route
========================= */
app.get("/", (req, res) => {
  res.send("Portfolio Backend Running 🚀");
});


/* =========================
   CONTACT API
========================= */
app.post("/api/contact", async (req, res) => {

  try {

    const { name, email, message } = req.body;

    // Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    console.log("Message saved in DB ✅");

    // Send Email
    try {

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({

        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Portfolio Contact Message",

        text: `
Name: ${name}
Email: ${email}

Message:
${message}
`

      });

      console.log("Email sent successfully ✅");

    } catch (emailError) {

      console.log("Email sending failed ❌", emailError.message);

    }

    res.status(201).json({
      message: "Message Saved Successfully ✅"
    });

  } catch (error) {

    console.log("Server Error ❌", error.message);

    res.status(500).json({
      error: error.message
    });

  }

});


/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

  console.log(`Server running on port ${PORT}`);

});