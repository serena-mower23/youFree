import React from "react";
import Navbar from "./NavBar";
import ScheduleSelector from "react-schedule-selector";
import 'url-search-params-polyfill';

let currentUser = null;

class EditView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: false
        }

      this.handleState = this.handleState.bind(this);
      this.handleLoad = this.handleLoad.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    // handleNewUser = (newUser) => {
    //     this.setState({users: []})
    // }

    handleState = (newSchedule) => {
        this.setState({schedule: newSchedule});
    }

    handleUpdate = async (e) => {
        e.preventDefault
        const param = {
            youFreeID: this.state.youFreeID,
            currentUser: currentUser, 
            creator: this.state.creator,
            users: this.state.users,
            schedule: this.state.schedule
        }

    let body = JSON.stringify(param)

    const res =  await fetch("/update", {
        method:"POST",
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log
    // const json = await res.json()
    // this.setState({ schedule: json.schedule})
    }

    handleLoad = async () => {
    const params = new URLSearchParams(window.location.search);

    const youFreeID = params.get("id");

        const param = {
            youFreeID: youFreeID,
        }

    let body = JSON.stringify(param)

    const res =  await fetch("/grabTemplate", {
        method:"POST",
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await res.json()

    currentUser = json.currentUser
    this.setState({ currentUser: json.currentUser})
    this.setState({ schedule: json.schedule })
    this.setState({ startDate: json.startDate})
    this.setState({ numDays: json.numDays})
    this.setState({ dateFormat: json.dateFormat})
    this.setState({ creator: json.creator})
    this.setState({ availableTime: json.availableTime})
    this.setState({ users: json.users})
    this.setState({ youFreeID: json.youFreeID})

    this.setState({ready:true})


        // const id = props.location.youFreeID
        // const creator = rops.location.creator

        // const props = {
        //     id: id,
        //     creator:creator
        // }

        // let body = JSON.stringify(props)

        // fetch("/grabAvail", {
        //     method:'POST',
        //     body,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(res => res.json())
        // .then(json => {
        //     console.log(json.schedule)
        //     this.setState({ schedule: json.schedule })
        //     this.setState({ready:true})
        // })
    }

    componentDidMount() {
        this.handleLoad()
    }

    render() {
        if (this.state.ready) {
            if (this.state.creator === currentUser) {
                return (
                    <div>
                        <Navbar />
                        <div className="col-md-6 themed-grid-col">
                            <p className="text-center">Click and drag to select your availability.</p>
                            <ScheduleSelector
                                selection={this.state.schedule}
                                startDate={this.state.startDate}
                                numDays={this.state.numDays}
                                minTime={8}
                                maxTime={22}
                                hourlyChunks={1}
                                dateFormat={this.state.dateFormat}
                                timeFormat={"h:mm a"}
                                unselectedColor={"#FA3D24"}
                                selectedColor={"rgba(80, 182, 51, 1)"}
                                hoveredColor={"#ADB2AE"}
                                onChange={this.handleState}
                            />
                        </div>
                        <div className="col-md-3 themed-grid-col">
                            {/* <form action="/create" method="PUT"> */}
                                <div className="d-grid d-sm-block text-center">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                                </div>
                            {/* </form> */}
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
                            <p className="text-center">Click and drag to select your availability.</p>
                            <ScheduleSelector
                                selection={this.state.schedule}
                                startDate={this.state.startDate}
                                numDays={this.state.numDays}
                                minTime={8}
                                maxTime={22}
                                hourlyChunks={1}
                                dateFormat={this.state.dateFormat}
                                timeFormat={"h:mm a"}
                                unselectedColor={"#FA3D24"}
                                selectedColor={"rgba(80, 182, 51, 1)"}
                                hoveredColor={"#ADB2AE"}
                                onChange={this.handleState}
                            />
                        </div>
                        <div className="col-md-3 themed-grid-col">
                            {/* <form action="/create" method="PUT"> */}
                                <div className="d-grid d-sm-block text-center">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                )
            }
        }
    }
}

export default EditView;