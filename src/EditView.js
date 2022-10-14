import React from "react";
import Navbar from "./NavBar";
import ScheduleSelector from "react-schedule-selector";

class EditView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // schedule: [],
            // startDate: props.location.startDate,
            // numDays: props.location.numDays,
            // dateFormat: props.location.dateFormat,
            // creator: props.location.creator,
            // availableTime: props.location.availableTime,
            // users: props.location.users,
            // youFreeID: props.location.youFreeID,
            // availableTime: props.location.availableTime,
            ready: false
        }

      this.handleState = this.handleState.bind(this);
      this.handleLoad = this.handleLoad.bind(this);
    }

    // handleNewUser = (newUser) => {
    //     this.setState({users: []})
    // }

    handleState = (newSchedule) => {
        this.setState({schedule: newSchedule});
        console.log(this.state.schedule);
    }

    handleLoad = e => {
        e.preventDefault()
        const id = props.location.youFreeID
        const creator = props.location.creator

        const json = {
            id: id,
            creator:creator
        }

        let body = JSON.stringify(json)

        fetch("/grabAvail", {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json.schedule)
            this.setState({ schedule: json.schedule })
            this.setState({ready:true})
        })
    }

    componentDidMount() {
        this.handleLoad()
    }

    render() {
        this.componentDidMount()
        if (this.state.ready) {
            if (this.state.creator === currentUser) {
                return (
                    <div>
                        <Navbar />
                        <div className="col-md-6 themed-grid-col">
                            <p className="text-center">Click and Drag to Toggle; Saved Immediately</p>
                            {/* <ScheduleSelector
                                selection={this.state.schedule}
                                startDate={props.location.startDate}
                                numDays={props.location.numDays}
                                minTime={8}
                                maxTime={22}
                                hourlyChunks={4}
                                dateFormat={props.location.dateFormat}
                                timeFormat={"h:mm a"}
                                unselectedColor={"#FA3D24"}
                                selectedColor={"rgba(80, 182, 51, 1)"}
                                hoveredColor={"#ADB2AE"}
                                onChange={this.handleState}
                            /> */}
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
                            {/* <ScheduleSelector
                                selection={this.state.schedule}
                                startDate={props.location.startDate}
                                numDays={props.location.numDays}
                                minTime={8}
                                maxTime={22}
                                hourlyChunks={4}
                                dateFormat={props.location.dateFormat}
                                timeFormat={"h:mm a"}
                                unselectedColor={"#FA3D24"}
                                selectedColor={"rgba(80, 182, 51, 1)"}
                                hoveredColor={"#ADB2AE"}
                                onChange={this.handleState}
                            /> */}
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
}

export default EditView;