import { Component } from 'react';
import './calendar.scss';
import moment from 'moment';
import LeftIcon from './resources/left_icon';
import RightIcon from './resources/right_icon';
import axios from 'axios';

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekday: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
            currentDate: moment(),
            month: moment().month(),
            eventList: [],
            today: moment()
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios   //Axios to send and receive HTTP requests
          .get("http://localhost:8000/api/todo/")
          .then(res => this.setState({ eventList: res.data }))
          .catch(err => console.log(err));
    };

    // set the current time to previous month 
    getPrevMonth = () => {
        this.setState({
            currentDate: this.state.currentDate.add(-1, 'month'),
            month: this.state.currentDate.month()
        })
    }

    // set the current time to next month
    getNextMonth = () => {
        this.setState({
            currentDate: this.state.currentDate.add(1, 'month'),
            month: this.state.currentDate.month()
        })
    }

    // get the array of days for the table
    getCurrentMonth = () => {
        let daysInPrevMonth = moment().month(this.state.month - 1).daysInMonth();
        let daysInCurMonth = this.state.currentDate.daysInMonth();
        let startWeekday = this.state.currentDate.startOf("month").weekday()
        let weeks = [];
        let startDay = daysInPrevMonth - startWeekday % 7; 
        let curMonth = "prev" 
        
        // render six rows
        let index = 1;
        while(index <= 42) {
            let days = []
            while(days.length < 7) {
                // determine the month for the index
                if(curMonth === "prev" && startDay + index > daysInPrevMonth) {
                    curMonth = "cur";
                }
                if(curMonth === "cur" && startDay + index > daysInCurMonth + daysInPrevMonth) {
                    curMonth = "next"
                }

                // calculate the day
                if(curMonth === "prev") {
                    days.push([startDay + index, "prev-month"]);
                }
                else if(curMonth === "cur") {
                    days.push([startDay + index - daysInPrevMonth, "cur-month"]);
                }
                else {
                    days.push([startDay + index - daysInPrevMonth - daysInCurMonth, "next-month"]);
                }

                // add today to class
                console.log(moment().calendar())
                
                index++;
            }
            weeks.push(days)
        }
        return weeks;
    }

    renderEvents = () => {

    }

    renderDays = () => {
        let weeks = this.getCurrentMonth();
        return (
            <tbody>
                {
                    weeks.map((days, index) => {
                        return (
                            <tr key={index}>
                                {
                                    days.map((day, index) => {
                                        let class_name = day[1]                                        
                                        if(index === 0 || index === 6) {
                                            class_name += " calendar-weekend"
                                        }
                                        return <td key={index} className={class_name}>{day[0]}</td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        )
    }

    renderHeader = () => {
        return (
            <thead>
                <tr><th colSpan="7">
                    <button onClick={this.getPrevMonth} className="btn btn-left"><LeftIcon /></button>
                    <div className='month-heading'>{this.state.currentDate.format('MMMM YYYY')}</div>
                    <button onClick={this.getNextMonth} className="btn btn-right"><RightIcon /></button>
                </th></tr>
                <tr>
                    {
                        this.state.weekday.map((weekday, index) => {
                            let class_name = "calendar-weekday"
                            if(index === 0 || index === 6) {
                                class_name="calendar-weekend"
                            }
                            return <th key={index} className={class_name}>{weekday}</th>;
                        })
                    }
                </tr>
            </thead>
        )
    }

    renderTable = () => {
        return (
        <div> 
            <table border="0" cellPadding="0" cellSpacing="0" className="calendar">
                {this.renderHeader()}
                {this.renderDays()}
            </table>
        </div>
        );
    }

    render() {
        return (
            <div className="content-wrapper">
                <button className="btn">New Event</button>
                {this.renderTable()}
            </div>
        )
    }
}

export default Calendar;
