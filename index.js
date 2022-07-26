require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const mongoUri = process.env['MONGO_URI']

mongoose.connect(mongoUri);

console.log(mongoose);
const { Schema } = mongoose;

const shortUrlSchema = new Schema({
  url:  String, // String is shorthand for {type: String}
});
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false})); // parse post body

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

shortUrls = {};

app.post('/api/shorturl', (req, res) => {

    console.log(`body url: ${req.body.url}`);
    if(!req.body || !req.body.url || !/^https?:\/\/.*?\..*?/.test(req.body.url))
      res.json({error : 'invalid url'});      
    dns.lookup(req.body.url.replace(/^(https?:\/\/)/,""), {all : true}, (err, addresses) => {
      if(err)
        res.json({error : 'invalid url'});
      else{
        console.log('url is valid');
        const shortUrl = new ShortUrl({url: req.body.url});
        console.log('created short url');
        shortUrl.save().then(urlSaved => res.json({ original_url: req.body.url, short_url: urlSaved._id}));
      }
    });
});
app.get('/api/shorturl/:shorturl', (req, res) => {
  console.log(`shorturl : ${req.params.shorturl}`);
  if(!req.params.shorturl)
      return res.json({error : 'invalid url'});
    
  ShortUrl.findById(req.params.shorturl).exec((err, url) => {
    console.log(`find by id (${req.params.shorturl})`);
    console.log(`err : ${err}`);
    console.log(`url : ${url}`);
    if(!err && url)
      return res.redirect(url.url);
    return res.json({error : 'invalid url'});
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
