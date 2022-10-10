import React, { useState} from "react";
import ScheduleSelector from "react-schedule-selector";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Select from "react-select";
import icsToJson from 'ics-to-json';
import Navbar from "./NavBar";

function datePicker() {
    const [value, onChange] = useState(new Date());
  
     return (
        <DatePicker onChange={onChange} value={value} />
     );
}
  
let origSchedule = []

const values = [
    {label: "Blank Week", startDate: new Date("10-09-2022"), numDays: 7, dateFormat: "ddd"},
    {label: "Blank Work Week", startDate: new Date("10-10-2022"), numDays: 5, dateFormat: "ddd"},
    {label: "Custom Week", startDate: new Date("10-10-2022"), numDays: 5, dateFormat: "m/d"}
]

class CalendarView extends React.Component {

    display = { 
        selectedOption: null,
        label: "Blank Week",
        startDate: new Date("10-09-2022"),
        numDays: 7,
        dateFormat: "d/m"
    };

    handleDisplay = (selectedOption) => {
        this.setState({ selectedOption: selectedOption });
        this.setState({ label: selectedOption.label})
        this.setState({ startDate: selectedOption.startDate });
        this.setState({ numDays: selectedOption.numDays });
        this.setState({ dateFormat: selectedOption.dateFormat });
        console.log(selectedOption);
    };

    // date = { date: new Date(),
    //          numDays: 7}

    // handleDate = 

    state = { schedule: [],
        otherSchedule: origSchedule };

    handleState = newSchedule => {
        this.setState({ schedule: newSchedule })
        this.setState({ otherSchedule: [...origSchedule, ...newSchedule]})
    }

    render() {
        const {selectedOption} = this.display

        return (
            <div>
                <div className="container">
                    <Navbar />
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <Select
                                value={selectedOption} 
                                options={values} 
                                onChange={this.handleDisplay}
                            />
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>

                <p>Select the times you're free below!</p>
                {datePicker}

                <div id="message">
                <h3>My Availability</h3>
                <p>Click and Drag to Toggle; Saved Immediately</p>
                </div>
                <div class="row justify-content-center">
                <div class="col-6">
                <ScheduleSelector
                    selection={this.state.schedule}
                    startDate={this.display.startDate}
                    numDays={this.display.numDays}
                    minTime={8}
                    maxTime={22}
                    hourlyChunks={4}
                    dateFormat={this.display.dateFormat}
                    timeFormat={"h:mm a"}
                    unselectedColor={"#FA3D24"}
                    selectedColor={"rgba(80, 182, 51, 1)"}
                    hoveredColor={"#ADB2AE"}
                    onChange={this.handleState}
                    />
                </div>
                {/* <div class="col-6">
                    <ScheduleSelector
                    selection={this.state.otherSchedule}
                    startDate={new Date()}
                    numDays={7}
                    minTime={8}
                    maxTime={22}
                    hourlyChunks={4}
                    timeFormat={"h:mm a"}
                    unselectedColor={"#FA3D24"}
                    selectedColor={"rgba(80, 182, 51, 1)"}
                    hoveredColor={"#ADB2AE"}
                    />
                </div> */}
                </div>
            </div>
        );
    }
}

export default CalendarView;
