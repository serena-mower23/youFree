import React from "react";
import Navbar from "./NavBar";
import ScheduleSelector from "react-schedule-selector";
import 'url-search-params-polyfill';

let currentUser = null;

class EditView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: false,
            addedUser: null,
            users: []
        }

      this.handleState = this.handleState.bind(this);
      this.handleLoad = this.handleLoad.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleAvail = this.handleAvail.bind(this)
    }

    handleState = (newSchedule) => {
        this.setState({schedule: newSchedule});
    }

    handleAvail = (availableTimes, type) => {
        console.log(availableTimes)
        let curAvail = availableTimes
        let timesArray = []
        
        for(let x = 0; x < curAvail.length; x++) {
            let timeCount = {
                totalUsers: 1,
                time: curAvail[x]
            }
            timesArray.push(timeCount)
        }

        for (let y = 0; y < timesArray.length; y++) {
            let currTimeCount = timesArray[y]
            let totalUsersUpdated = currTimeCount.totalUsers
            let time = currTimeCount.time
            if (this.state.users > 0) {
                for (let i = 0; i < this.state.users.length; i++) {
                    if (this.state.users[i].userAvail.length !== 0) {
                        for (let j = 0; j < this.state.users[i].userAvail; j++) {
       
                            if (this.state.users[i].userAvail[j] === currTimeCount.time) {
                                totalUsersUpdated++;
                            }
                        }
                    }
                }
                currTimeCount = {
                    totalUsers: totalUsersUpdated,
                    time:time
                }
                timesArray[y] = currTimeCount
            }
        }

        let changedTimes = []    
        for (let i = 0; i < timesArray.length; i++) {
            console.log(timesArray[i])
            let date = new Date(timesArray[i].time)
            let dateString = ""

            console.log("WHYYY")
            console.log(type)

            if (type === 0) {
                dateString = date.toLocaleString()
            }
            else if (type === 1) {
                let dateStringFirst = date.toLocaleString('en-us', {  weekday: 'long' })
                let second = date.toLocaleTimeString()
                console.log(second)
                dateString = dateStringFirst + ", " + second
            }
            console.log(dateString)
            changedTimes.push(dateString)
        }



        this.setState({ timesArray: changedTimes})

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
        // window.location.reload()
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

        console.log("jfhasd")
        console.log(json)

        currentUser = json.currentUser
        this.setState({ name: json.name})
        this.setState({ currentUser: json.currentUser})
        this.setState({ schedule: json.schedule })
        this.setState({ startDate: json.startDate})
        this.setState({ numDays: json.numDays})
        this.setState({ dateFormat: json.dateFormat})
        this.setState({ creator: json.creator})
        this.setState({ availableTimes: json.availableTimes})
        this.setState({ users: json.users})
        this.setState({ youFreeID: json.youFreeID})
        this.setState({type:json.type})

        this.handleAvail(json.availableTimes, json.type)
        console.log(this.state.availableTimes)

        this.setState({ready:true})
    }

    // handleNameChange = newName => {
    //     this.setState({ready: false});
    //     this.setState({name: newName.target.value});
    // }

    handleAddUser = addedUser => {
        this.setState({addedUser: addedUser.target.value})        
    }

    handleUpdateAddedUsers = e => {
        e.preventDefault();
        
        if (this.state.addedUser !== null) {
            const youFreeID = this.state.youFreeID;
            const creator = this.state.creator;
            const currListUsers = this.state.users;
            // how to grab input value
            const invitedUser = this.state.addedUser;
            currListUsers.push(invitedUser);

            const json = {
                youFreeID: youFreeID,
                // creator: creator,
                invitedUser: invitedUser,
                // users: currListUsers
            }
            let body = JSON.stringify(json)

            // Prevent creator from inviting themselves
            // alert current user?
            if (invitedUser !== creator) {
                fetch("/updateUsers", {
                    method:"POST",
                    body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(json => {
                    if (json.userExists) {
                        alert("The user has been invited.")
                    } else {
                        alert("The username does not exist.")
                    }
                })
            } else {
                alert("Please provide a username that is not your own.")
            }
            document.getElementById("addedUser").value = ""
            this.setState({addedUser: null})
            //window.location.href = "http://localhost:8080/home"
        } else {
            alert("Please provide a username to invite.")
        }
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
                        <div className="row justify-content-evenly">
                            <div className="col-md-6 themed-grid-col">
                                <h1 className="text-center">{this.state.name}</h1>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="addedUser">Invite Users to This youFree:</label>
                                    <input className="form-control" type="text" name="addedUser" id="addedUser" onChange={this.handleAddUser} required/>
                                    {/* <div className="invalid-feedback">Please provide an existing username for your youFree.</div>  */}
                                </div>
                                <div className="d-grid d-sm-block text-center">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdateAddedUsers}>Invite</button>
                                </div>
                                <p className="text-center mt-5">Click and drag to select your availability.</p>
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
                                {/* <form action="/create" method="PUT"> */}
                                <div className="d-grid d-sm-block text-center mt-4">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                                </div>
                                {/* </form> */}
                            </div>
                            <div className="col-md-4 themed-grid-col">
                                <h4 className="text-center mt-5">Available Times</h4>
                                <ul>
                                    {this.state.timesArray.map( (time, index) =>
                                        <li>{time}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Navbar />
                        <div className="row justify-content-evenly">
                            <div className="col-md-6 themed-grid-col">
                                <h1 className="text-center">{this.state.name}</h1>
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
                                {/* <form action="/create" method="PUT"> */}
                                <div className="d-grid d-sm-block text-center mt-4">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                                </div>
                                {/* </form> */}
                            </div>
                            {/* <div className="col-md-4 themed-grid-col">
                                
                            </div> */}
                        </div>
                    </div>
                )
            }
        }
    }
}
export default EditView;