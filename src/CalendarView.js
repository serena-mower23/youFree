import React, { useState} from "react";
import ScheduleSelector from "react-schedule-selector";
import Select from "react-select";
import Navbar from "./NavBar";

const values = [
    {label: "Custom Week", weekType: 0, dateFormat:"M/D"},
    {label: "Blank Week", weekType: 1, dateFormat: "ddd"},
]

const days = [
    {label: "Sunday", startDate: new Date("10-09-2022")},
    {label: "Monday", startDate: new Date("10-10-2022")},
    {label: "Tuesday", startDate: new Date("10-11-2022")},
    {label: "Wednesday", startDate: new Date("10-12-2022")},
    {label: "Thursday", startDate: new Date("10-13-2022")},
    {label: "Friday", startDate: new Date("10-14-2022")},
    {label: "Saturday", startDate: new Date("10-15-2022")},
]

class Template extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            schedule: []
        }

    this.handleState = this.handleState.bind(this);

    }

    handleState = (newSchedule) => {
        let origSchedule = this.state.schedule;
        console.log("Orig Sch: " + origSchedule);
        this.setState({schedule: newSchedule});
        // this.setState({schedule: [...origSchedule, ...newSchedule]})
        this.props.parentCallBack(this.state.schedule)
    }

    render() {
        return(
            <div>
                <ScheduleSelector
                    selection={this.state.schedule}
                    startDate={this.props.startDate}
                    numDays={this.props.numDays}
                    minTime={8}
                    maxTime={22}
                    dateFormat={this.props.dateFormat}
                    timeFormat={"h:mm a"}
                    hourlyChunks={1}
                    unselectedColor={"#FA3D24"}
                    selectedColor={"rgba(80, 182, 51, 1)"}
                    hoveredColor={"#ADB2AE"}
                    onChange={this.handleState}
                    />
            </div>
        )
    }
}

class CalendarView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            weekType: 0,
            name: "Event Name",
            schedule: [],
            dateFormat: "M/D",
            label: "Custom Week",
            startDate: new Date(),
            numDays: 7, 
            minTime: 8,
            maxTime: 22,
            ready: false
        }

      this.handleDisplay = this.handleDisplay.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleCallBack = this.handleCallBack.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
      this.handleDaysChange = this.handleDaysChange.bind(this);
      this.handleNumChange = this.handleNumChange.bind(this);
      this.handleCreate = this.handleCreate.bind(this);
    }
      
    handleDisplay = selectedOption => {
        this.setState({ready: false});
        this.setState({ weekType: selectedOption.weekType});
        this.setState({ label: selectedOption.label});
        this.setState({ dateFormat: selectedOption.dateFormat})
    };

    handleCallBack = (newSchedule) => {
        this.setState({ schedule: newSchedule })
        console.log("Ar eyou here")
        console.log(this.state.schedule)
    }
  
    handleUpdate = () => {
        this.setState({ ready: true });
    }

    handleNameChange = newName => {
        this.setState({ready: false});
        this.setState({name: newName.target.value});
    }

    handleDateChange = newDate => {
        this.setState({ready: false});
        const date = newDate.target.value;
        if(date.length == 10) {
            this.setState({startDate: new Date(date)}
            )
        }
    }

    handleCreate = e => {
        e.preventDefault()
        console.log("schedule")
        console.log(this.state.schedule)
        console.log("sir")
        const json = {
            schedule:this.state.schedule,
            name:this.state.name,
            dateFormat: this.state.dateFormat,
            startDate: this.state.startDate,
            numDays: this.state.numDays,
            type: this.state.weekType
        }
        let body = JSON.stringify(json)
        console.log("YOU MAKE NOWSNESE")
        console.log(body)

        fetch('/createYF', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        window.location.href = "http://localhost:8080/home"
    }

    handleNumChange = (newNum) => {
        this.setState({ready: false});
        this.setState({numDays: newNum.target.value})
    }

    handleDaysChange = selectedOption => {
        this.setState({ready: false});
        this.setState({startDate: selectedOption.startDate});
        this.setState({label: selectedOption.label});
    }

    render() {
        if (this.state.ready === false) {
            if (this.state.weekType === 0) {
            return (
                <div>
                    <Navbar />
                    <div className="row justify-content-evenly">
                        <div className="col-md-3 themed-grid-col">
                            <div className="mb-5 mt-5m-auto">
                                <p>Select the type of youFree you wish to create.</p>
                                <Select
                                    options={values}
                                    placeholder={"Select"}
                                    onChange={this.handleDisplay}
                                />
                            </div>
                            <p>Enter the information for your youFree below.</p>
                            <div className="mb-5 m-auto">
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="youFreeName">Event Name:</label>
                                    <input className="form-control" type="text" name="youFreeName" id="youFreeName" onChange={this.handleNameChange} required/>
                                <div className="invalid-feedback">Please provide a name for your youFree.</div> 
                                </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="startDate">Start Date (mm-dd-yyyy):</label>
                                        <input className="form-control" type="text" name="startDate" id="startDate" onChange={this.handleDateChange} required/>
                                    <div className="invalid-feedback">Please provide a start date.</div> 
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="numberDays">Number of Days:</label>
                                            <input className="form-control" type="text" name="numberDays" id="numberDays" onChange={this.handleNumChange} required/>
                                            <div className="invalid-feedback">Please provide a number of days.</div> 
                                    </div>
                                <div className="d-grid d-sm-block text-center">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update Template</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 themed-grid-col">
                            <div className="ms-5">
                                <h1 className="text-center">{this.state.name}</h1>
                                <p className="text-center">Click and drag to select your availability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
            }
            else if (this.state.weekType == 1) {
                return (
                    <div>
                        <Navbar />
                        <div className="row justify-content-evenly">
                            <div className="col-md-3 themed-grid-col">
                                <div className="mb-5 mt-5m-auto">
                                    <p>Select the type of youFree you wish to create.</p>
                                    <Select
                                        options={values} 
                                        placeholder={"Select"}
                                        onChange={this.handleDisplay}
                                    />
                                </div>
                                <p>Enter the information for your youFree below.</p>
                                <div className="mb-5 m-auto">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="youFreeName">Event Name:</label>
                                        <input className="form-control" type="text" name="youFreeName" id="youFreeName" onChange={this.handleNameChange} required/>
                                        <div className="invalid-feedback">Please provide a name for your youFree.</div> 
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="startDate">Starting Day:</label>
                                        <Select
                                            options={days} 
                                            placeholder={"Select"}
                                            onChange={this.handleDaysChange}
                                            required
                                        />
                                        <div className="invalid-feedback">Please provide a day of the week.</div> 
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="numberDays">Number of Days:</label>
                                        <input className="form-control" type="text" name="numberDays" id="numberDays" onChange={this.handleNumChange} required/>
                                        <div className="invalid-feedback">Please provide a number of days.</div> 
                                    </div>
                                    <div className="d-grid d-sm-block text-center">
                                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update Template</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 themed-grid-col">
                                <div className="ms-5">
                                    <h1 className="text-center">{this.state.name}</h1>
                                    <p className="text-center">Click and drag to select your availability.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        else {
            if (this.state.weekType === 0) {
                return (
                    <div>
                        <Navbar />
                        <div className="row justify-content-evenly">
                            <div className="col-md-3 themed-grid-col">
                                <div className="mb-5 mt-5m-auto">
                                    <p>Select the type of youFree you wish to create.</p>
                                    <Select
                                        options={values} 
                                        placeholder={"Select"}
                                        onChange={this.handleDisplay}
                                    />
                                </div>
                                <p>Enter the information for your youFree below.</p>
                                <div className="mb-5 m-auto">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="youFreeName">Event Name:</label>
                                        <input className="form-control" type="text" name="youFreeName" id="youFreeName" onChange={this.handleNameChange} required/>
                                    <div className="invalid-feedback">Please provide a name for your youFree.</div> 
                                    </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="startDate">Start Date (mm-dd-yyyy):</label>
                                            <input className="form-control" type="text" name="startDate" id="startDate" onChange={this.handleDateChange} required/>
                                        <div className="invalid-feedback">Please provide a start date.</div> 
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="numberDays">Number of Days:</label>
                                                <input className="form-control" type="text" name="numberDays" id="numberDays" onChange={this.handleNumChange} required/>
                                                <div className="invalid-feedback">Please provide a number of days.</div> 
                                        </div>
                                    <div className="d-grid d-sm-block text-center">
                                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update Template</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 themed-grid-col">
                                <div className="ms-5">
                                    <h1 className="text-center">{this.state.name}</h1>
                                    <p className="text-center">Click and drag to select your availability.</p>
                                </div>
                                <div className="mb-5 m-auto">
                                    {/* <form action="/create" method="POST"> */}
                                        <div className="d-grid d-sm-block text-center">
                                            <button type="submit" className="btn btn-primary" onClick={this.handleCreate}>Create youFree?</button>
                                        </div>
                                    {/* </form> */}
                                </div>
                                <Template 
                                    selection={this.state.schedule} 
                                    startDate={this.state.startDate} 
                                    numDays={this.state.numDays}
                                    dateFormat={this.state.dateFormat}
                                    parentCallBack = {this.handleCallBack}
                                />
                            </div>
                        </div>
                    </div>
                );
            }
            else if (this.state.weekType == 1) {
                return (
                    <div>
                        <Navbar />
                        <div className="row justify-content-evenly">
                            <div className="col-md-3 themed-grid-col">
                                <div className="mb-5 mt-5m-auto">
                                    <p>Select the type of youFree you wish to create.</p>
                                    <Select
                                        options={values} 
                                        placeholder={"Select"}
                                        onChange={this.handleDisplay}
                                    />
                                </div>
                                <p>Enter the information for your youFree below.</p>
                                <div className="mb-5 m-auto">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="youFreeName">Event Name:</label>
                                        <input className="form-control" type="text" name="youFreeName" id="youFreeName" onChange={this.handleNameChange} required/>
                                        <div className="invalid-feedback">Please provide a name for your youFree.</div> 
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="startDate">Starting Day:</label>
                                        <Select
                                            options={days}
                                            placeholder={"Select"}
                                            onChange={this.handleDaysChange}
                                            required
                                        />
                                        <div className="invalid-feedback">Please provide a day of the week.</div> 
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="numberDays">Number of Days:</label>
                                        <input className="form-control" type="text" name="numberDays" id="numberDays" onChange={this.handleNumChange} required/>
                                        <div className="invalid-feedback">Please provide a number of days.</div> 
                                    </div>
                                    <div className="d-grid d-sm-block text-center">
                                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdate}>Update Template</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 themed-grid-col">
                                <div className="ms-5">
                                    <h1 className="text-center">{this.state.name}</h1>
                                    <p className="text-center">Click and drag to select your availability.</p>
                                </div>
                                <div className="mb-5 m-auto">
                                    {/* <form action="/create" method="POST"> */}
                                        <div className="d-grid d-sm-block text-center">
                                            <button type="submit" className="btn btn-primary" onClick={this.handleCreate}>Create youFree?</button>
                                        </div>
                                    {/* </form> */}
                                </div>
                                    <Template 
                                        selection={this.state.schedule} 
                                        startDate={this.state.startDate} 
                                        numDays={this.state.numDays}
                                        dateFormat={this.state.dateFormat}
                                        parentCallBack = {this.handleCallBack}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }
        }
    }
}

export default CalendarView;
