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
        this.handleLoad()
    }

    render() {
        this.componentDidMount()
        if (this.state.ready) {
            return (
                <div className="container">
                    <Navbar />
                    <EventGroup title={"My Events"}  events={this.state.created} />
                    <EventGroup title={"Invitations"} events={this.state.invited} />
                </div>
            );
        }
    }
}

export default Home;