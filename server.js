const express = require( 'express' ),
      app     = express()

app.use( express.json() )

app.use( express.static( 'dist' ) )
app.use( express.static( 'src' ) )

app.listen( 8080 )
