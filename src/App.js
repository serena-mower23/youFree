
import React, { useState} from "react";
import { hot } from "react-hot-loader/root";
import ScheduleSelector from "react-schedule-selector";
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'


function datePicker() {
  const [value, onChange] = useState(new Date());

  return (
    <DatePicker onChange={onChange} value={value} />
  );
}

let origSchedule = []

class App extends React.Component {
  state = { schedule: [],
            otherSchedule: origSchedule };

  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule })
    this.setState({ otherSchedule: [...origSchedule, ...newSchedule]})
  }

    // function when submit is clicked
    submitForm = () => {
      // get form div
      const form = document.getElementById('form');
      // removes element from DOM after submitting
      form.style.display = 'none';
      // get message/instructions div
      const message = document.getElementById('message');
      // show message/instructions after submitting
      message.style.display = 'block';
    }

  render() {
    return (
      <div>
        <h1>youFree?</h1>
        <p>Select the times you're free below!</p>
        {datePicker}
        <div id="form">
          <h3>Sign In</h3>
          <input type="text" placeholder="Name"></input>
          <input type="password" placeholder="Password (optional)"></input>
          <button onClick={this.submitForm}>Submit</button>
        </div>
        <div id="message">
          <h3>My Availability</h3>
          <p>Click and Drag to Toggle; Saved Immediately</p>
        </div>
        <div class="row justify-content-center">
          <div class="col-4">
          <ScheduleSelector
              selection={this.state.schedule}
              numDays={7}
              minTime={8}
              maxTime={22}
              hourlyChunks={4}
              timeFormat={"h:mm a"}
              unselectedColor={"#FA3D24"}
              selectedColor={"rgba(80, 182, 51, 1)"}
              hoveredColor={"#ADB2AE"}
              onChange={this.handleChange}
              />
          </div>
          <div class="col-4">
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
          </div>
        </div>
      </div>
    );
  }
}

export default hot(App);
