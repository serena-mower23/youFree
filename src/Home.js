import React from "react";
import EventGroup from "./EventGroup";
import Navbar from "./Navbar";

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            created: [],
            invited: [],
            ready: false
        }

        this.handleLoad = this.handleLoad.bind(this)
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleLoad = async () => {
        window.addEventListener('load', this.handleNewUser);
        const res = await fetch("/getYFs", {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await res.json()
        if (json.created.length > 0) {
            this.setState({ created: json.created })
        }
        if (json.invited.length > 0) {
            this.setState({ invited: json.invited })
        }
        this.setState({ ready: true})
    }


    async handleNewUser() {
        let body = ""
        const res = await fetch( '/newuser', {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        })
        const json = await res.json()
          if (json.newUser) {
            alert("Your user account has been created.")
          }
    }
    
    componentDidMount() {
        this.handleLoad()
    }

    render() {
        if (this.state.ready) {
            return (
                <div>
                    <div className="container">
                        <Navbar />
                        <EventGroup title={"My Events"} message={"You don't have any created events."} events={this.state.created} />
                        <EventGroup title={"Invitations"} message={"You don't have any event invitations."} events={this.state.invited} />
                    </div>
                </div>
            );
        }
    }
}

export default Home;
