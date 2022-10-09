const express = require( 'express' ),
      app     = express()

app.use( express.json() )

app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html', function(err) {
        res.status(500).send(err)
    })
})

app.listen( 8080 )
