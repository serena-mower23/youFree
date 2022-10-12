import axios from "axios";
import React from "react";
import EventGroup from "./EventGroup";
import Navbar from "./NavBar";

const invited = [],
      created = []

const originalPull = function( e ) {
    e.preventDefault()

    fetch( '/eventYF', {
      method:'GET'
    })

    .then(function( res ) {
        let event = res.body();
        console.log(event);
        setUpData(event)
    })
    return false
}

function setUpData(event) {
    console.log(event)
    console.log(event.invited)
    console.log(event.invited)
    invited = event.invited
    created = event.created
}


window.onload = function() {
    originalPull()
    .then( data => {
    setUpData(data)
    console.log(data)
    })
}

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            created: created,
            invited: invited
        }
        
        console.log(created);
    }

    // componentDidMount() {
    //     axios.get('/eventsYF')
    //     .then(res => {
    //         const created = res.data.created;
    //         const invited = res.data.invited;
    //         this.setState({ created: created });
    //         this.setState({ invited: invited});
    //         console.log(this.state.created);
    //         console.log(this.state.invited);
    //     })
    // }    

    render() {
        return (
            <div className="container">
                <Navbar />
                <EventGroup title="My Events" events={this.state.created} />
                <EventGroup title="Invitations" events={this.state.invited} />
            </div>
        );
    }
}

export default Home;
