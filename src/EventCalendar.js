import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const view = function(e) {
    e.preventDefault()
    let json = {
        name: this.props.name,
        users: this.props.users,
        creator: this.props.creator,
        availableTimes: this.props.availableTimes,
        youFreeID: this.props.youFreeID,
        dateFormat: this.props.dateFormat,
        numDays: this.props.numDays,
        startDate: this.props.startDate
      }
      let body = JSON.stringify(json)
      fetch( '/view', {
        method:'GET',
        body 
      })
}

window.onload = function() {
    const button = document.getElementById( "viewButton" )
    button.onclick = view
}

class EventCalendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            users: this.props.users,
            creator: this.props.creator,
            youFreeID: this.props.youFreeID,
            dateFormat: this.props.dateFormat,
            numDays: this.props.numDays,
            startDate: this.props.startDate,
            availableTimes: this.props.availableTimes
        }
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title d-inline">{this.props.name}</h5>
                    <div className="d-md-flex justify-content-md-end">
                        <Link 
                            className="btn btn-primary view-button" 
                            to={{
                                pathname: '/edit-calendar',
                                name: this.props.name,
                                users: this.props.users,
                                creator: this.props.creator,
                                youFreeID: this.props.youFreeID,
                                dateFormat: this.props.dateFormat,
                                numDays: this.props.numDays,
                                startDate: this.props.startDate,
                                availableTimes: this.props.availableTimes
                                }}>
                                View
                        </Link>
                        <button className="btn btn-danger ms-1">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCalendar;
