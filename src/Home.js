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
    
    componentDidMount = (e) => {
        // e.preventDefault()
        window.addEventListener('load', this.handleNewUser);
        fetch("/eventsYF", {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            this.setState({ created: json.created })
            this.setState({ invited: json.invited })
            this.setState({ ready: true})
        })

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