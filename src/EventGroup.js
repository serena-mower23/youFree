import React from "react";
import EventCalendar from "./EventCalendar";

class EventGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: this.props.events
    }
  }
    render() {
        return (
            <div className="mb-5">
                <h1 className="mb-3">{this.props.title}</h1>
                {this.state.events.map( (event, index) => 
                    <EventCalendar 
                      key={index} 
                      id={index} 
                      name={event.name}
                      users={event.users}
                      creator={event.creator}
                      youFreeID={event.youFreeID}
                      dateFormat={event.dateFormat}
                      numDays={event.numDays}
                      startDate={event.startDate}
                      availableTimes={event.availableTimes}/>
                )}
            </div>
        )
    }
}

export default EventGroup;
