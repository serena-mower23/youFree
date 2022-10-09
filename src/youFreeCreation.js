
import React from "react";
import { hot } from "react-hot-loader/root";
import DatePicker from 'react-date-picker'

function datePicker() {
    const [value, onChange] = useState(new Date());
  
    return (
      <div>
        <DatePicker onChange={onChange} value={value} />
      </div>
    );
  }

class App extends React.Component {
  state = { schedule: [] }

  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule })
  }

  render() {
    return (
      <div>
        <div></div>
        <div> 
          <h1>youFree?</h1>
          <p>Select the times you're free below!</p>
          </div>
      </div>
    );
  }
}

export default hot(App);
