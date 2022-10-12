import React from "react";
import EventGroup from "./EventGroup";
import Navbar from "./NavBar";

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <Navbar />
                <EventGroup title="My Events" owner={true} />
                <EventGroup title="Invitations" owner={false} />
            </div>
        );
    }
}

export default Home;
