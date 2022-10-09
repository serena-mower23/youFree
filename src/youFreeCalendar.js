import React, {ChangeEventHandler, useState} from "react";
import { hot } from "react-hot-loader/root";
import { format, addDays } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
//import "react-day-picker/dist/style.cc";
//import ScheduleSelector from "react-schedule-selector";


// function dayPicker() {
//     const [range, setRange] = useState<DateRange | undefined>('');

//     let prompt = <p>Please pick the range of days you want.</p>;
//     if (range?.from) {
//         if (!range.to) {
//             prompt = <p>{format(range.from, "PPP")}</p>;
//         } 
//         else if (range.to) {
//             prompt = (
//                 <p>
//                    {format(range.from, "PPP")}-{format(range.to, "PPP")} 
//                 </p>
//             );
//         }
//     }
//     return (
//         <DayPicker
//             mode="range"
//             defaultMonth={new Date()}
//             min={1}
//             max={7}
//             selected={range}
//             onSelect={setRange}
//             footer={prompt}
//         />    
//     )
// }

// let origSchedule = 

class youFreeCalendar extends React.Component {

    state = { schedule: [],
              otherSchedule: origSchedule};

    handleChange = newSchedule => {
        this.setState({ schedule: newSchedule })
        this.setState({ otherSchedule: [...origSchedule, ...newSchedule]})
    }

    render() {
        return (
            <div>
                {/* {dayPicker()} */}
        <ScheduleSelector
          selection={this.state.schedule}
          numDays={7}
          minTime={8}
          maxTime={22}
          hourlyChunks={4}
          columnGaps={"6 px"}
          rowGaps={"6 px"}
          unselectedColor={"rgba(255, 0, 0, 1)"}
          selectedColor={"rgba(80, 182, 51, 1)"}
          hoveredColor={"#ADB2AE"}
          onChange={this.handleChange}
          />
          </div>
        )
    }
}

export default hot(youFreeCalendar);