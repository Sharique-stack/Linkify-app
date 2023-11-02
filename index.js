// Dependencies
const express = require("express");
const compression = require("compression");
const multer = require("multer");
const path = require('path');
const shortid = require('shortid');
const fs = require('fs');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// var upload = multer();// only /uploads


// Modules
const app = express();

// Sets ejs as the template engine
app.set("view engine", "ejs");

// Enables Gzip compression
app.use(compression());

// Serving files in the public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/send", upload.single("fileName"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  originalName=req.file.originalname;
  // Generate a unique short link for the file
  let shortLink = shortid.generate();
  console.log('Generated Short Link:', shortLink);
    const fileBuffer = req.file.buffer;
    let ext=(originalName.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1] ;
    shortLink=shortLink+'.'+ext;
    const filePath = path.join(__dirname,'public/uploads',shortLink);

    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'File upload failed.' });
      }


    console.log(shortLink);
    // res.render("index", { shortLinkURL });
    res.json({ success: true, link: shortLink});

    });
  });
  // }

app.listen(8080);
