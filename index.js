require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false})); // parse post body

app.get('/', function(req, res) {
  console.log('homepage!');
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  console.log('hello!');
  res.json({ greeting: 'hello API' });
});

shortUrls = {};

app.post('/api/shorturl', (req, res) => {
    console.log(`body url: ${req.body.url}`);
    if(!/^https?:\/\/.*?\..*?/.test(req.body.url))
      res.json({error : 'invalid url'});      
    shortUrls[req.params.shorturl] = req.body.url;
    dns.lookup(req.body.url.replace(/^(https?:\/\/)/,""), {all : true}, (err, addresses) => {
      if(err)
        res.json({error : 'invalid url'});
      else
        res.json({ original_url: req.body.url, short_url: 1});
    });
});
app.get('/api/shorturl/:shorturl', (req, res) => {
    if(req.params.shorturl in shortUrls)
      res.redirect(shortUrls[req.params.shorturl]);
    else
      res.json({error : 'invalid url'});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
