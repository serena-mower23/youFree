const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app     = express(),
      cookie = require( 'cookie-session' )

require('dotenv').config()

app.use( express.json() )
app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )
app.use(express.urlencoded({ extended : true }));

// app.engine( 'handlebars',  hbs() )
// app.set(    'view engine', 'handlebars' )
// app.set(    'views',       './dist' )

// app.set('view engine', 'html');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');

// app.use(methodOverride());
// app.use(cookieParser());

//Database connection
const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.HOST+"/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient( uri, { useNewURLParser: true, useUnifiedTopology:true });
let userCollection = null;
let youFreeCollection = null;
let newUser = false;
let curUser = null  // I don't know if there's a better way to store this lol

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
    userCollection = __collection
    return userCollection.find({ }).toArray()
})

app.post('/login', (req, res) => {
  console.log("/login request: ")
  console.log(req.body)
  userCollection.find({username: req.body.username})
  .toArray()
  .then(result => {
    req.session.username = req.body.username
    req.session.password = req.body.password

    if (result.length > 0) {
      if (req.body.password === result[0].password) {
        req.session.login = true
        // redirect to home page
        res.redirect('http://localhost:8080/home')
      } else {
        // stay at login page
        res.redirect('http://localhost:8080')
      }
    } else {
      newUser = true
      req.body.created = []
      req.body.invited = []
      userCollection.insertOne( req.body )
      req.session.login = true
      res.redirect('http://localhost:8080/home')
    }
  })
  // .then(result => {
  //   res.json(newUser)
  // }).then( json => console.log(json))
})

app.post('/logout', (req, res, next) => {
  console.log("/logout request: ")
  console.log(req.body)
  req.session.login = false
  next()
})

app.use( function(req, res, next) {
  if ( req.session.login === true ) {
    next()
  } else {
    res.redirect('http://localhost:8080')
  }
})

client.connect() 
.then( () => {
  return client.db( 'test' ).collection('youFrees')
})
.then( __collection => {
  youFreeCollection = __collection
  return youFreeCollection.find({ }).toArray()
})


//fun fact, didn't actually do anything cause we were redirecting in the client

// app.post('/view', async (req, res) => {
//   console.log("/view request: ")
//   console.log(req.body)
//   const result = await youFreeCollection.find({_id: mongodb.ObjectId(req.body.youFreeID)})
//   console.log("Youadsfga")
//   console.log(result.body)
//   // const json = res.json(result)
//   console.log("Here?")
// })

app.post('/newuser', (req, res) => {
  res.json({newUser: newUser})
  if (newUser) {
    newUser = false;
  }
})

app.post('/createYF', async (req, res) => {
  console.log("/createYF request: ")
  console.log(req.body)
  const json = {
    name: req.body.name,
    startDate: req.body.startDate,
    users: [],
    creator: req.session.username,
    availableTimes: [],
    dateFormat: req.body.dateFormat,
    numDays: req.body.numDays,
    youFreeID: ""
  }
  await youFreeCollection.insertOne(json)
  const result = await youFreeCollection.findOne({$and: [{"name" :req.body.name}, {"creator": req.session.username}] })
  const id = result._id.toString()
  await youFreeCollection.updateOne(
    {$and: [{"name" :req.body.name}, {"creator": req.session.username}] },
    {$set: {"youFreeID": id, "availableTimes": req.body.schedule}})

  const current = await userCollection.findOne({"username": req.session.username})
  currentArray = current.created
  const update = {
    youFreeID: id, 
    userAvail: req.body.schedule
  }
  currentArray.push(update)
  await userCollection.updateOne(
    {"username": req.session.username},
    { $set: {"created": currentArray}}
  )
  // res.redirect('http://localhost:8080/home')
})

// creating function to invite user to youFree



//this doesn't do anything right

// app.get('/loadYF', async function(req, res) {
//   console.log("/loadYFrequest: ")
//   console.log(req.body)
//   const data = await youFreeCollection.find({ }).toArray()
//   let body = {
//     username: req.session.username,
//     youFreeInfo: data
//   }
//   res.json(body);
// })

app.get('/eventsYF', async function(req, res) {
  console.log("/eventsYF request: ")
  //console.log(req.body)
  let createdArray = [];
  let invitedArray = [];
  const current = await userCollection.findOne({"username":req.session.username})
  if (current.created !== null) {
    createdArray = current.created
  }
  if (current.invited !== null) {
    invitedArray = current.invited
  }
  
  let body = {
    "created": createdArray,
    "invited": invitedArray
  }

  res.json(body);
})

app.post('/grabTemplate', async function(req, res) {
  console.log("/grabTemplate")
  console.log(req.body)
  const current = await youFreeCollection.findOne({_id: mongodb.ObjectId(req.body.youFreeID)})
  const users = await userCollection.findOne({"username":req.session.username})
  let youFrees = []
  let schedule = []

  if (req.session.username === current.creator) {
    youFrees = users.created
  }
  else {
    youFrees = users.invited
  } 

  for (let i = 0; i < youFrees.length; i++) {
    if (youFrees[i].youFreeID === req.body.youFreeID) {
      schedule = youFrees[i].userAvail
    }
  }
  if (current !== null) {
    console.log("I'm over here")
    console.log(current.availableTimes)
    const body = {
      name: current.name,
      startDate: current.startDate,
      schedule: schedule,
      numDays: current.numDays,
      dateFormat: current.dateFormat, 
      creator: current.creator,
      availableTimes: current.availableTimes,
      users: current.users,
      youFreeID: current.youFreeID,
      currentUser: req.session.username
    }

    console.log(body.availableTimes)

  res.json(body);
  }
})

// app.post('/eventsYF', async function(req, res) {
//   let createdArray = [];
//   let invitedArray = [];
//   const current = await userCollection.find({"username":req.session.username}).toArray()
//   const curCreated = current[0] === null ? null : current[0].created
//   const curInvited = current[0] === null ? null : current[0].invited

  // for (let i=0; i < curCreated.length; i++) {
  //   let cur = await youFreeCollection.findOne({"youFreeID": curCreated[i].youFreeID});
  //   createdArray.push(cur)
  // }

  // for (let i=0; i < curInvited.length; i++) {
  //   let cur = await youFreeCollection.findOne({"youFreeID": curInvited[i].youFreeID});
  //   invitedArray.push(cur)
  // }

//   let result = {
//     "created": curCreated,
//     "invited": curInvited
//   }
//   res.json(result);
// })

// add youFree to user's list of invited youFrees



// add user to youFree's list of users
app.post("/updateUsers", async (req, res) => {
  console.log("/update users request: ")
  console.log(req.body)
  let userExists = false

  // if (req.session.username === req.body.creator) {
  // is this user already in the users list?
  // is this user NOT the creator?

  const current = await youFreeCollection.findOne({_id: mongodb.ObjectId(req.body.youFreeID)})

  // check if the user has already been invited
  if (!current.users.includes(req.body.invitedUser)) {
    // current should be invited user
    const user = await userCollection.findOne({"username": req.body.invitedUser})
    // check if the user exists in the database
    if (user !== null) {
      userExists = true
      // add the event to the user
      let invited = user.invited
      let newEvent = {
        "youFreeID": req.body.youFreeID,
        "userAvail": []
      }
      invited.push(newEvent)
      userCollection.updateOne({"username":req.body.invitedUser}, {$set: {"invited": invited}})

      // add the user to the event
      let currentUsers = current.users
      currentUsers.push(req.body.invitedUser)
      youFreeCollection.updateOne({_id: mongodb.ObjectId(req.body.youFreeID)}, {$set: {"users": currentUsers}})
    }
  }
  res.json({userExists: userExists})
})

app.get("/getUser", async (req, res) => {
  const username = req.session.username

  const json = {
    username
  }
  res.json(json)

})

app.post("/update", async (req, res) => {
  console.log("/update request: ")
  console.log(req.body)
  let updated = []
  const current = await userCollection.findOne({"username":req.session.username})

  if (req.session.username === req.body.creator) {
    let curArray = current.created
    for (let i = 0; i < curArray.length; i++) {
      if (curArray[i].youFreeID === req.body.youFreeID) {
        const updatedBody = {
          "youFreeID": req.body.youFreeID,
          "userAvail": req.body.schedule
        }
        updated.push(updatedBody)
      } else {
        updated.push(curArray[i])
      }
      userCollection.updateOne({"username":req.session.username}, {$set: {"created": updated}})
    }
  } else {
    let curArray = current.invited
    for (let i = 0; i < curArray.length; i++) {
      if (curArray[i].youFreeID === req.body.youFreeID) {
        const updatedBody = {
          "youFreeID": req.body.youFreeID,
          "userAvail": req.body.schedule
        }
        updated.push(updatedBody)
      } else {
        updated.push(curArray[i])
      }
      userCollection.updateOne({"username":req.session.username}, {$set: {"invited": updated}})
    }
  }
})

app.post('/getAvail', async function(req, res) {
  console.log("/getAvail request: ")
  console.log(req.body)
  let selection = []
  let event = []
  const current = await userCollection.findOne({"username":req.session.username})
  if (req.body.json.creator === req.session.username) {
    event = current.created
  }
  else {
    event = current.invited
  }
  for (let i=0; i < event.length; i++) {
    if (event[i].youFreeID === req.body.json.youFreeID) {
      selection = event[i].userAvail;
    }
  }
  res.json(selection);
})

/*
  if creator:
    - delete youFree object
    - remove object with youFreeID from creator's created list
    - remove object with youFreeID from invited list for each participant
  if participant:
    - remove participant name from object with youFreeID
    - remove object with youFreeID from invited list
    
  Need:
    - youFreeID
    - creator name
    - current user
*/

app.post('/delete', (req, res) => {
  console.log("req.session.username: " + req.session.username)
  console.log("req.body.creator: " + req.body.creator)
  if (req.session.username === req.body.creator) {
    // the current user is the event creator
    youFreeCollection.deleteOne({_id: mongodb.ObjectId(req.body.youFreeID)})
    // remove event from creator
    userCollection.find({username: req.body.creator})
    .toArray()
    .then(result => {
      let created = result[0].created
      for (let i = 0; i < created.length; i++) {
        if (created[i].youFreeID === req.body.youFreeID) {
          // remove event from creator's list
          created.splice(i, 1)
        }
      }
      // update the collection
      userCollection.updateOne(
        {username: req.body.creator},
        {$set: {created: created}}
      )
    })
    // remove event from all participants
    userCollection.find({})
    .toArray()
    .then(result => {
      for (let i = 0; i < result.length; i++) {
        let username = result[i].username
        let invited = result[i].invited
        for (let j = 0; j < invited.length; j++) {
          if (invited[j].youFreeID === req.body.youFreeID) {
            // remove event from participant's list
            invited.splice(j, 1)
          }
        }
        // update the collection
        userCollection.updateOne(
          {username: username},
          {$set: {invited: invited}}
        )
      }
    })
  } else {
    // the current user is not the event creator
    youFreeCollection.find({_id: mongodb.ObjectId(req.body.youFreeID)})
    .toArray()
    .then(result => {
      let users = result[0].users
      for (let i = 0; i < users.length; i++) {
        if (users[i] === req.session.username) {
          // remove current user from user list
          users.splice(i, 1)
        }
      }
      // update the collection
      youFreeCollection.updateOne(
        {_id: mongodb.ObjectId(req.body.youFreeID)},
        {$set: {users: users}}
      )
    })
    // find the current user and delete the event from their invited list
    userCollection.find({username: req.session.username})
    .toArray()
    .then(result => {
      let invited = result[0].invited
      for (let i = 0; i < invited.length; i++) {
        if (invited[i].youFreeID === req.body.youFreeID) {
          // remove current user from user list
          invited.splice(i, 1)
        }
      }
      // update the collection
      userCollection.updateOne(
        {username: req.session.username},
        {$set: {invited: invited}}
      )
    })
  }
})

app.post('/getInfo', async function(req, res) {
  console.log("/getInfo request: ")
  console.log(req.body)
  const current = await youFreeCollection.find({}).toArray()
  let sendName = ""
  let sendCreator = ""
  for (let i = 0; i < current.length; i++) {
    let objString = current[i]._id.toString()
    if (objString === req.body.youFreeID) {
      sendName = current[i].name
      sendCreator = current[i].creator
    }
  }
  const json = {
    name: sendName,
    creator: sendCreator
  }
  res.json(json)
})

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html', function(err) {
        res.status(500).send(err)
    })
})

app.listen( 8080 )
