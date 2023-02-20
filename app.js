const express = require("express");
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require ("mongoose")
const bcrypt = require('bcrypt');
const app = express()
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Chirasak:12345678Aito@cluster0.cc1mbi9.mongodb.net/mydatabase?retryWrites=true&w=majority")

// const uri = "mongodb+srv://Chirasak:12345678Aito@cluster0.cc1mbi9.mongodb.net/mydatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     if (err) console.log(err);
//     else console.log("Database Connect Successfully!");
// });


var alert = "" 

app.get('/alert', (req, res) => {
    const message = alert;
    res.render('alert', { message: message });
});

app.get("/", (req, res) => {
    res.render("login1", { alert: alert });
})

app.get("/index",(req, res)=> {
    res.render("index");
})   

app.post('/login1', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let emailLower = email.toLowerCase();

    client.connect((err) => {
        if (err) throw err;
        const db = client.db("mydatabase");
        const collection = db.collection("users");
        collection.findOne({ email: emailLower }, (err, result) => {
            if (err) throw err;
            if (result) {
                bcrypt.compare(password, result.password, (err, isMatch) => {
                    if (isMatch) {
                        alert = "Login successful"
                        nameUser = result.name;
                        console.log(alert);
                        res.redirect("/alert");
                    } else {
                        alert = "Invalid email or password"
                        console.log(alert);
                        res.redirect("/alert");
                    }
                });
            } else {
                alert = "Invalid email or password"
                console.log(alert);
                res.redirect("/alert");
            }
        });
    });
});

app.post('/signup', (req, res) => {
    const name = req.body.sname;
    const email = req.body.semail;
    const password = req.body.spassword;
    let emailLower = email.toLowerCase();

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            client.connect((err) => {
                if (err) throw err;
                const db = client.db("mydatabase");
                const collection = db.collection("users");
                collection.findOne({ email: emailLower }, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        alert = "User with that email already exists"
                        console.log(alert);
                        res.redirect("/alert");
                    } else {
                        const document = { name: name, email: emailLower, password: hash };
                        collection.insertOne(document, (err, result) => {
                            if (err) throw err;
                            console.log("Document inserted successfully");
                            alert = "Sign UP Successfully"
                            console.log(alert);
                            res.redirect("/alert");
                        });
                    }
                });
            });
        });
    });
});

app.listen (3000, () => {
    console.log("Server opened on port 3000")
})
