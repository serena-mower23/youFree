const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app     = express()
      cookie = require( 'cookie-session' )
      // httpProxy = require('http-proxy');
      // proxy = httpProxy.createServer({});
    //   hbs     = require( 'express-handlebars' ).engine,
    //   config = require('./src/config.js'),
    //   cookieParser = require('cookie-parser'),
      ////expressSession = require('express-session'),
    //   methodOverride = require('method-override');

app.use( express.json() )

app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )
require('dotenv').config()

// app.engine( 'handlebars',  hbs() )
// app.set(    'view engine', 'handlebars' )
app.set(    'views',       './dist' )

// app.set('view engine', 'html');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');

// app.use(methodOverride());
// app.use(cookieParser());

app.use(express.urlencoded({ extended : true }));


//Database connection
const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.HOST+"/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient( uri, { useNewURLParser: true, useUnifiedTopology:true });
let collection = null;


//connect to database and grab collection
app.use( cookie({
  name: 'session',
  keys: ['key934537823', 'key974123823']
}))

client.connect() 
  .then( () => {
    return client.db( 'test' ).collection( 'test' )
})
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
})

app.post( '/login', (req,res)=> {
  let seen = false

  client.db( 'test' ).collection( 'test' ).find().forEach(element => {
    collection.find({username: req.body.username})
    .toArray()
    .then(result => {
      req.session.username = req.body.username
      req.session.password = req.body.password

      if (result.length > 0) {
        if (req.body.password === result[0].password) {
          req.session.login = true
          //redirect to home page?
        } else {
          //stay at login page
        }
      } else {
        req.body.data = []
        collection.insertOne( req.body ).then(result => {
          //proxy.web(req, res, { target: 'http://localhost:8080/home' });
        })

      }
    })

  })
})

app.get('/', function(req, res) {
    res.render('index');
  });

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html', function(err) {
        res.status(500).send(err)
    })
})
  

app.listen( 8080 )
