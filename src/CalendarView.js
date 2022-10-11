import React, { useState} from "react";
import ScheduleSelector from "react-schedule-selector";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import Select from "react-select";
import icsToJson from 'ics-to-json';
import Navbar from "./NavBar";
import axios from 'axios';
  
let origSchedule = [new Date('2022-10-01 10:00:00'),
new Date('2022-10-01 11:00:00'),
new Date('2022-10-01 12:00:00'),
new Date('2022-10-01 13:00:00'),
new Date('2022-10-01 14:00:00'),
new Date('2022-10-02 12:00:00'),
new Date('2022-10-02 13:00:00'),
new Date('2022-10-02 14:00:00'),
new Date('2022-10-02 15:00:00'),
new Date('2022-10-02 16:00:00'),]

let blankSchedule = []

const values = [
    {label: "Blank Week", startDate: new Date("10-09-2022"), numDays: 7, dateFormat: "ddd"},
    {label: "Blank Work Week", startDate: new Date("10-10-2022"), numDays: 5, dateFormat: "ddd"},
    {label: "Custom Week", startDate: new Date("10-10-2022"), numDays: 5, dateFormat: "m/d"}
]

// const inputFile = document.querySelector('input')

// const convert = async (inputFile) => {
//     const icsRes = await fetch(inputFile)
//     const icsData = await icsRes.text()
//     // Convert
//     const data = icsToJson(icsData)
//     return data
// }

// const json = convert(inputFile)
// let dates = []

// console.log(json);

// json.forEach((element,index) => {
//     let date = {
//         startDate: element.startDate,
//         endDate: element.endDate
//     }
//     dates.append(date)
// })


class CalendarView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            schedule: [],
            otherSchedule: origSchedule,
            selectedOption: {
                label: "Blank Week",
                startDate: new Date("10-09-2022"),
                numDays: 7,
                dateFormat: "d/m"
            },
            //selectedFile: null,
            dateStart: new Date("10-02-2022"),
            dateEnd: new Date("10-04-2022"),
            flag: true
        }

      this.onFileChange = this.onFileChange.bind(this);
      this.handleDisplay = this.handleDisplay.bind(this);
      this.handleState = this.handleState.bind(this);
      this.handleDateChange = this.handleDateChange(this);

    }
      
    handleDisplay = selectedOption => {
        this.setState({ selectedOption: selectedOption });
        this.setState({ label: selectedOption.label})
        this.setState({ startDate: selectedOption.startDate });
        this.setState({ numDays: selectedOption.numDays });
        this.setState({ dateFormat: selectedOption.dateFormat });
        console.log(selectedOption);
    };

    handleState = newSchedule => {
        this.setState({ schedule: newSchedule })
        this.setState({ otherSchedule: [...origSchedule, ...newSchedule]})
    }

      // On file select (from the pop up)
      onFileChange = event => {
      
        // Update the state
        this.setState({ selectedFile: event.target.files[0]});
        console.log("hello from the inside of onFileChange");
        console.log(event.target.files[0]);
        const icsRes = fetch(event.target.files[0])
        const icsData = icsRes.text()
            // Convert
        const data = icsToJson(icsData)
        this.console.log(data)
      };

      handleDateChange = newDay => {
        console.log(newDay)
        if (this.flag) {
            this.setState({ dateStart: newDay});
            this.setState({ flag:false})
        }
        else {
            this.setState({ dateEnd: newDay});
            this.setState({ flag:true})
        }
      }
    
      // On file upload (click the upload button)
    //   onFileUpload = () => {
      
    //     // Create an object of formData
    //     const formData = new FormData();

    //     console.log("hello from the inside of onFileUpload");
      
    //     // Update the formData object
    //     // formData.append(
    //     //   "myFile",
    //     //   this.file.selectedFile,
    //     //   this.file.selectedFile.name
    //     // );
      
    //     // Details of the uploaded file
    //     // console.log("hello");
    //     // console.log(this.file.selectedFile);
      
    //     // Request made to the backend api
    //     // Send formData object
    //     // axios.post("api/uploadfile", formData);
    //   };
      
      // File content to be displayed after
      // file upload is complete
    //   fileData = () => {
      
    //     if (this.file.selectedFile) {
           
    //       return (
    //         <div>
    //             <h2>File Details:</h2>
    //             <p>File Name: {this.file.selectedFile.name}</p>
    //             <p>File Type: {this.file.selectedFile.type}</p>
    //             <p>
    //                 Last Modified:{" "}
    //                 {this.file.selectedFile.lastModifiedDate.toDateString()}
    //             </p>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div>
    //           <br />
    //           <h4>Choose before Pressing the Upload button</h4>
    //         </div>
    //       );
    //     }
    //   };
      
    render() {

        return (
            <div>
                <Navbar />
                <div class="row justify-content-evenly">
                    <div className="col-md-3 themed-grid-col">
                        <div class="mb-5 mt-5 m-auto">
                            <p>Select the type of youFree you wish to create.</p>
                            <Select
                                value={this.state.selectedOption.label} 
                                options={values} 
                                onChange={this.handleDisplay}
                            />
                        </div>
                        <div className="mb-5 m-auto">
                            <p>Enter the dates you want to create a youFree for.</p>

                            <form class="needs-validation" action="/create" method="POST" novalidate>
                                <div class="mb-3">
                                    <label class="form-label" for="username">Start Date:</label>
                                    <input class="form-control" type="text" name="username" id="username" required/>
                                    <div class="invalid-feedback">Please provide a start date.</div> 
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="password">End Date:</label>
                                    <input class="form-control" type="password" name="password" id="password" required/>
                                    <div class="invalid-feedback">Please provide an end date.</div> 
                                </div>
                                <div class="d-grid d-sm-block text-center">
                                    <h1>The button doesn't work yet, will try and POST to /create, which doesn't exist</h1>
                                    <button type="submit" class="btn btn-primary">Create Calendar</button>
                                </div>
                            </form>
                        </div>
                        <div class="mb-5">
                            {/* Currently just shows the calendar */}
                            <Calendar 
                                // returnValue={"range"}
                                // selectRange={true}
                                //onClikcDay={this.handleDateChange} 
                                //value={[this.state.dateStart, this.state.dateEnd]} 
                            />
                        </div>
                    </div>
                    <div class="col-md-6 themed-grid-col">
                        <h3 class="text-center">My Availability</h3>
                        <p class="text-center">Click and Drag to Toggle; Saved Immediately</p>
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
                </div>
                {/* <div>
                    <h3>
                        File Upload using React!
                    </h3>
                    <div>
                        <input type="file" onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload!
                        </button>
                    </div> */}
                    {/* {this.fileData()} */}
                {/* </div> */}
            </div>
        );
    }
}

export default CalendarView;
