const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app     = express()

app.use( express.json() )

app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )
require('dotenv').config()


const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.HOST+"/?retryWrites=true&w=majority";
const client = new MongoClient( uri, { useNewURLParser: true, useUnifiedTopology:true, serverApi: ServerApiVersion.v1 });
let collection = null;

//connect to database and grab collection
client.connect() 
  .then( () => {
    return client.db( 'test' ).collection( 'test' )
})
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
})

app.listen( 8080 )
