import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DatePicker from 'react-datepicker'
import _ from 'lodash'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import ScheduleDay from './schedule-day'
import './practice-schedule.css'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class PracticeSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(),
      selectedDate: moment(),
      daysToShow: [],
    }

    this.handleDateSelect = this.handleDateSelect.bind(this);
  }

  componentDidMount() {
    this.buildDateArray();
  }

  render() {
    const { schedule } = this.props;
    const { daysToShow } = this.state;
    console.log(this.state.daysToShow);
    return (
      <div className="practice-schedule">
        <h1>Available Times</h1>
        <div className="calendar-wrapper">
          {
            daysToShow.map(day => {
              let sessions = _.pickBy(schedule, function(value, key) {
                return key === day.date
              })

              return <ScheduleDay key={day.date} {...day} sessions={sessions} />
            })
          }
        </div>
        <div className="form-wrapper">
          <h1>Schedule A Time</h1>
          <DatePicker
            selected={this.state.selectedDate}
            onChange={this.handleDateSelect}
          />
        </div>
      </div>
    )
  }

  buildDateArray() {
    let daysArr = [];
    let day = this.state.startDate.day();
    let date = this.state.startDate;
    let count = 0;

    while (count < 7) {
      daysArr.push({name: days[day - 1], date: date.format('MMDDYY')});
      count++;
      if (day <= 6) {
        day++;
        date.add(1, 'days');
      } else {
        day = 1;
        date.add(1, 'days');
      }
    }

    this.setState({daysToShow: daysArr});
  }

  handleDateSelect(selectedDate) {
    this.setState({selectedDate}, () => { console.log(this.state)})
  }
}

const mapState = (state) => {
  return {
    schedule: state.schedule
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticeSchedule))
