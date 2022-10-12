import React from "react";
import Navbar from "./NavBar";
import ScheduleSelector from "react-schedule-selector";

const currentUser = null,
      name = null,
      schedule = null,
      startDate = null,
      numDays = null, 
      dateFormat = null,
      owner = null,
      users = null;

const originalPull = function( e ) {
    e.preventDefault()

    fetch( '/loadYF', {
      method:'GET'
    })

    .then(function( res ) {
        let event = res.json();
        console.log(event);
        setUpData(event)
    })
    return false
}

function setUpData(event) {
    currentUser = event.currentUser;
    name = event.name;
    schedule = event.schedule; 
    startDate = event.startDate;
    numDays = event.numDays;
    dateFormat = event.dateFormat;
    owner = event.owner;
    users = event.users;
}

window.onload = function() {
    originalPull()
    .then( data => {setUpData(data)})
}

class EditView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            schedule: schedule, //need to have this be the imported schedule of the user
            startDate: startDate,
            numDays: numDays,
            dateFormat: dateFormat,
            owner: owner,
            users: users
        }

      this.handleState = this.handleState.bind(this);
    }

    // handleNewUser = (newUser) => {
    //     this.setState({users: []})
    // }

    handleState = (newSchedule) => {
        this.setState({schedule: newSchedule});
        console.log(this.state.schedule);
    }

    render() {
        if (this.state.owner === currentUser) {
            return (
                <div>
                    <Navbar />
                    <div className="col-md-3 themed-grid-col">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="numberDays">Number of Days:</label>
                            <input className="form-control" type="text" name="numberDays" id="numberDays" onChange={this.handleNumChange} required/>
                            <div className="invalid-feedback">Please provide a number of days.</div> 
                        </div>
                        <div className="d-grid d-sm-block text-center">
                            <button type="submit" className="btn btn-primary" onClick={this.handleNewUser}>Update Template</button>
                        </div>
                    </div>
                    <div className="col-md-6 themed-grid-col">
                        <p className="text-center">Click and Drag to Toggle; Saved Immediately</p>
                        <ScheduleSelector
                            selection={this.state.schedule}
                            startDate={this.state.startDate}
                            numDays={this.state.numDays}
                            minTime={8}
                            maxTime={22}
                            hourlyChunks={4}
                            dateFormat={this.state.dateFormat}
                            timeFormat={"h:mm a"}
                            unselectedColor={"#FA3D24"}
                            selectedColor={"rgba(80, 182, 51, 1)"}
                            hoveredColor={"#ADB2AE"}
                            onChange={this.handleState}
                        />
                    </div>
                    <div className="col-md-3 themed-grid-col">
                        <form action="/create" method="PUT">
                            <div className="d-grid d-sm-block text-center">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                    <h1>Available times:</h1>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Navbar />
                    <div className="col-md-6 themed-grid-col">
                        <p className="text-center">Click and Drag to Toggle; Saved Immediately</p>
                        <ScheduleSelector
                            selection={this.state.schedule}
                            startDate={this.state.selectedOption.startDate}
                            numDays={this.state.selectedOption.numDays}
                            minTime={8}
                            maxTime={22}
                            hourlyChunks={4}
                            dateFormat={this.state.selectedOption.dateFormat}
                            timeFormat={"h:mm a"}
                            unselectedColor={"#FA3D24"}
                            selectedColor={"rgba(80, 182, 51, 1)"}
                            hoveredColor={"#ADB2AE"}
                            onChange={this.handleState}
                        />
                    </div>
                    <div className="col-md-3 themed-grid-col">
                        <form action="/create" method="PUT">
                            <div className="d-grid d-sm-block text-center">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }

    }
}

export default EditView;