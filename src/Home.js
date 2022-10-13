import axios from "axios";
import React from "react";
import EventGroup from "./EventGroup";
import Navbar from "./NavBar";

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            created: [],
            invited: [],
            ready: false
        }
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleLoad = () => {
        axios.get("/eventsYF" )
        .then(res => {
            this.setState({ created: res.data.created })
            this.setState({ invited: res.data.invited })
            this.setState({ ready: true})
        })
    }

    componentDidMount() {
        window.addEventListener('load', this.handleNewUser);
        this.handleLoad()
        // fetch("/eventsYF", {
        //     method: "POST"
        // })
        // .then(response => response.json())
        // .then(data => {
        //     this.setState({ created: data.created })
        //     this.setState({ invited: data.invited })
        // })
        // .then(res => this.setState({ ready: true}))

    
    }

    handleNewUser() {
        let body = ""
        fetch( '/newuser', {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        })
        .then( function( response ) {
          return response.json()
        })
        .then ( function ( json ) {
          if (json.newUser) {
            alert("New user created!")
          }
        })
    }

    render() {
        this.componentDidMount()
        if (this.state.ready) {
            return (
                <div>
                    {/* <div className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Hello
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
            
                            </div>
                        </div>

                    </div> */}
                    <div className="container">
                        <Navbar />
                        <EventGroup title={"My Events"}  events={this.state.created} />
                        <EventGroup title={"Invitations"} events={this.state.invited} />
                    </div>
                </div>
            );
        }
    }
}

export default Home;