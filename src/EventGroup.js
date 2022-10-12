import React from "react";
import EventCalendar from "./EventCalendar";

const calendars = [
    {
      title: "Webware Final Project",
      owner: true
    },
    {
      title: "CS 1101 Homework",
      owner: false
    },
    {
      title: "Exec Meeting",
      owner: false
    }
  ]

class EventGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events:this.props.events
    }
  }
    render() {
        return (
            <div className="mb-5">
                <h1 className="mb-3">{this.props.events.name}</h1>
                {events.map( (event, index) => 
                    <EventCalendar key={index} id={index} title={event.title} />
                )}
            </div>
        )
    }
}

export default EventGroup;
