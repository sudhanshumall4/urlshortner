const express = require("express");
const path = require("path");
const cookieParser=require("cookie-parser");
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const {restrictToLoggedinUserOnly,checkAuth}=require("./middleware/auth");
const urlRoute = require("./routes/url");
const staticRoute= require('./routes/static');
const userRoute=require('./routes/user');

const app = express();
const PORT = 5527;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// Static files middleware
app.use(express.static(path.join(__dirname, 'public'))); // Assuming you want to serve static files from 'public'

// If you have a static route handler, use it properly


// URL route
app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/", checkAuth,staticRoute);


// Test route to render EJS template
app.get('/test', async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.render("home", { 
            urls: allUrls, // Pass data to the template
        });
    } catch (err) {
        console.error("Error fetching URLs:", err);
        return res.status(500).send("Internal Server Error");
    }
});

// Redirect route
app.get('/url/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { 
                $push: { visitHistory: { timestamp: Date.now() } } 
            }
        );

        if (entry) {
            return res.redirect(entry.redirectURL);
        } else {
            return res.status(404).send("URL not found");
        }
    } catch (err) {
        console.error("Error redirecting:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Start server
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));