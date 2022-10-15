const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app     = express(),
      cookie = require( 'cookie-session' )

require('dotenv').config()

app.use( express.json() )
app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )
app.use(express.urlencoded({ extended : true }));

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
        console.log("DO YOU EVEN GO HERE")
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

app.post('/newuser', (req, res) => {
  res.json({newUser: newUser})
  if (newUser) {
    newUser = false;
  }
})

app.post('/createYF', async (req, res) => {
  console.log("/createYF request: ")
  console.log("i swear")
  console.log(req.body)
  const json = {
    name: req.body.name,
    startDate: req.body.startDate,
    users: [],
    creator: req.session.username,
    availableTimes: req.body.schedule,
    dateFormat: req.body.dateFormat,
    numDays: req.body.numDays,
    youFreeID: "",
    type: req.body.type
  }
  console.log("sadgfads")
  console.log(req.body.type)
  await youFreeCollection.insertOne(json)
  const result = await youFreeCollection.findOne({$and: [{"name" :req.body.name}, {"creator": req.session.username}] })
  const id = result._id.toString()
  await youFreeCollection.updateOne(
    {$and: [{"name" :req.body.name}, {"creator": req.session.username}] },
    {$set: {"youFreeID": id, "availableTimes": req.body.schedule, "type": req.body.type}})

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





app.get('/eventsYF', async function(req, res) {
  console.log("/eventsYF request: ")
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
      currentUser: req.session.username,
      type: current.type
    }
   console.log(body) 
  res.json(body);
  }
})

// add youFree to user's list of invited youFrees


// creating function to invite user to youFree
// add user to youFree's list of users
app.post("/updateUsers", async (req, res) => {
  console.log("/update users request: ")
  console.log(req.body)
  // 1 if user doesn't exist
  // 2 if user exists and isn't already added
  // 3 if user exists and is already added
  let userExists = -1


  // if (req.session.username === req.body.creator) {
  // is this user already in the users list?
  // is this user NOT the creator?

  const user = await userCollection.findOne({"username": req.body.invitedUser})
  const current = await youFreeCollection.findOne({_id: mongodb.ObjectId(req.body.youFreeID)})

  //check if the user exists in the database
  if (user === null) {
    userExists = 1
  } else {
      // check if the user has already been invited
    if (!current.users.includes(req.body.invitedUser)) {
      userExists = 2
      const curInvited = user.invited;
      userExists = 2;
      for (let i = 0; i < curInvited.length; i++) {
        if (curInvited[i].youFreeID === req.body.youFreeID) {
          userExists = 3;
        }
      }
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
    else {
      userExists = 3
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

// app.post("/update", async (req, res) => {
//   console.log("/update")
//   console.log(req.body)
//   const youFreeInfo = await youFreeCollection.findOne({_id: mongodb.ObjectId(req.body.youFreeID)})
//   const userInfo = await userCollection.findOne({"username": req.session.username})
  
//   if (req.session.username === req.body.creator) {
//     let curArray = userInfo.created
//     for (let i = 0; i < curArray.length; i++) {
//       if (curArray[i].youFreeID === req.body.youFreeID) {
//         const updatedBody = {
//           "youFreeID": req.body.youFreeID,
//           "userAvail": req.body.schedule
//         }
//         updated.push(updatedBody)
//       } else {
//         updated.push(curArray[i])
//       }
//       userCollection.updateOne({"username":req.session.username}, {$set: {"created": updated}})
//       let availTimes = youFree.availableTimes 
//       let newTimes = []
//       if (availTimes.length === 0) {
//         newTimes = req.body.schedule
//       }
//       else {
//         for (let i = 0; i < availTimes.length; i++) {
//           if (req.body.schedule.includes(availTimes[i])) {
//             newTimes.push(availTimes[i])
//           }
//         }
//       }
//       console.log("resulting merge")
//       console.log(newTimes)
//       youFreeCollection.updateOne({_id: mongodb.ObjectId(req.body.youFreeID)}, {$set: {"availableTimes": newTimes}})
//     }
//   }
// })

app.post("/update", async (req, res) => {
  console.log("/update request: ")
  console.log(req.body)
  let updated = []
  const current = await userCollection.findOne({"username":req.session.username})
  const youFree = await youFreeCollection.findOne({_id: mongodb.ObjectId(req.body.youFreeID)})

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

      // let availTimes = youFree.availableTimes 
      // let newTimes = []
      // if (availTimes.length === 0) {
      //   newTimes = req.body.schedule
      // }
      // else {
      //   for (let i = 0; i < availTimes.length; i++) {
      //     if (req.body.schedule.includes(availTimes[i])) {
      //       newTimes.push(availTimes[i])
      //     }
      //   }
      // }
      // console.log("resulting merge")
      // console.log(newTimes)
      // youFreeCollection.updateOne({_id: mongodb.ObjectId(req.body.youFreeID)}, {$set: {"availableTimes": newTimes}})
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

    // let availTimes = youFree.availableTimes 
    // let newTimes = []
    // if (availTimes.length === 0) {
    //   newTimes = req.body.schedule
    // } 
    // else {
    //   for (let i = 0; i < availTimes.length; i++) {
    //     if (req.body.schedule.includes(availTimes[i])) {
    //       newTimes.push(availTimes[i])
    //     }
    //   }
    // }

    // console.log("resulting merge")
    // console.log(newTimes)
    // youFreeCollection.updateOne({_id: mongodb.ObjectId(req.body.youFreeID)}, {$set: {"availableTimes": newTimes}})

  }
})

app.post('/getAvail', async function(req, res) {
  console.log("/getAvail request: ")
  console.log(req.body)
  let userCount = 0

  let availTimes = []
  console.log("SERIOPIS;")
  console.log(req.body.creator)

  let creatorInfo = await userCollection.findOne({"username":req.body.creator})
  console.log("creator info")
  console.log(creatorInfo.created)

  for (let i = 0; i < creatorInfo.created.length; i++) {
    if (creatorInfo.created[i].youFreeID === req.body.youFreeID) {
      if (creatorInfo.created[i].userAvail.length > 0) {
        userCount++;
        for (let k = 0; k < creatorInfo.created[i].userAvail.length; k++) {
          availTimes.push(creatorInfo.created[i].userAvail[k])
        }
      }
    }
  }

  
  if (req.body.users.length > 0) {
    for (let j = 0; j < req.body.users.length; j++) {
      let currUser = await userCollection.findOne({"username": req.body.users[j]})
      console.log(req.body.users[j])
      for (let x = 0; x < currUser.invited.length; x++) {
        if (currUser.invited[x].youFreeID === req.body.youFreeID) {
          if (currUser.invited[x].userAvail.length > 0) {
            userCount++;
            console.log("confusion")
            for (let b = 0; b < currUser.invited[x].userAvail.length; b++) {
              console.log("noooo")
              console.log(currUser.invited[x].userAvail[b])
              availTimes.push(currUser.invited[x].userAvail[b])
            }
          }
        }
      }
    }
  }

  let mergedTimes = {}
  let finalAvail = []

  console.log("avail")
  console.log(availTimes)

  for(let g = 0; g < availTimes.length; g++) {
    if (mergedTimes.hasOwnProperty(availTimes[g])) {
      let currenCount = mergedTimes[availTimes[g]] + 1
      mergedTimes[availTimes[g]] = currenCount
    }
    else {
      mergedTimes[availTimes[g]] = 1;
    }
  } 
  console.log(mergedTimes)
  console.log(userCount)
  for (let key in mergedTimes) {
    if (mergedTimes[key] === userCount) {
      console.log(key)
      finalAvail.push(key)
    }
  }
  console.log("pleasee")
  console.log(finalAvail)
  res.json(finalAvail);

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
