import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Dropdown} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import ScheduleDay from './schedule-day'
import './practice-schedule.css'
import {createPairMiddleware, addSessionMiddleware, fetchSchedule} from './practice-schedule-reducer'
import {times} from './times'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class PracticeSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(),
      selectedDate: moment(),
      selectedTimeStart: '',
      selectedTimeEnd: '',
      daysToShow: [],
    }

    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSessionClick = this.handleSessionClick.bind(this);
  }

  componentDidMount() {
    this.props.loadSchedule();
    this.buildDateArray();
  }

  componentDidUpdate(prevProps, prevState) {
    const currentStart = this.state.startDate.format('YYYYMMDD');
    const prevStart = prevState.startDate.format('YYYYMMDD')
    if (currentStart !== prevStart) {
      this.buildDateArray();
    }
  }

  render() {
    if (this.props.isLoggedIn)  {
      const { schedule, handleAddSession} = this.props;
      const { startDate, daysToShow, selectedDate, selectedTimeStart, selectedTimeEnd } = this.state;
      const start = this.state.startDate.clone().format('MMM Do YYYY');
      const end = this.state.startDate.clone().add(6, 'days').format('MMM Do YYYY');
      console.log(schedule)
      return (
        <div className="practice-schedule">
          <h1>Available Times {`(${start} - ${end})`}</h1>
          <div className="calendar-wrapper">
            {
              daysToShow.map(day => {
                let sessions = schedule.filter(session => {
                  return session.date === day.date;
                })

                return <ScheduleDay key={day.date} {...day} sessions={sessions} handleClick={this.handleSessionClick} />
              })
            }
          </div>
          <div className="calendar-nav">
            {(startDate.format('YYYYMMDD') !== moment().format('YYYYMMDD')) &&
              <button onClick={() => this.handlePrevClick()}>Prev Week</button>}
            <button onClick={() => this.handleNextClick()}>Next Week</button>
          </div>
          <div className="form-wrapper">
            <h1>Schedule A Time</h1>
            <DatePicker
              selected={this.state.selectedDate}
              onChange={this.handleDateSelect}
            />
            <p>Scheduled practice sessions are 1 hour long. We will add 1 hour time blocks between your selected available start and end times.</p>
            <Dropdown placeholder="Start Time" fluid selection value={selectedTimeStart} options={times} onChange={(evt, { value }) => this.handleTimeSelect('selectedTimeStart', value)} />
            <Dropdown placeholder="End Time" fluid selection value={selectedTimeEnd} options={times} onChange={(evt, { value }) => this.handleTimeSelect('selectedTimeEnd', value)} />
            <button onClick={() => handleAddSession(selectedDate, selectedTimeStart, selectedTimeEnd)} >Add Time</button>
          </div>
        </div>
      )
    } else return <div>Must be logged in to see schedule</div>;
  }

  buildDateArray() {
    let daysArr = [];
    let day = this.state.startDate.day();
    let date = this.state.startDate.clone();
    let count = 0;

    while (count < 7) {
      daysArr.push({name: days[day - 1], date: date.format('YYYY-MM-DD')});
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

  handleSessionClick(type, session) {
    console.log("handling click", session)
    const {handleCreatePair} = this.props;
    if (type === 'available') {
      handleCreatePair(session);
    }
  }

  handleNextClick() {
    let newStart = this.state.startDate.clone().add(7, 'days')
    this.setState({startDate: newStart})
  }

  handlePrevClick() {
    let newStart = this.state.startDate.clone().subtract(7, 'days')
    this.setState({startDate: newStart})
  }

  handleTimeSelect(type, time) {
    this.setState({[type]: time})
  }
}

const mapState = (state) => {
  return {
    schedule: state.schedule,
    isLoggedIn: !!state.user.id

  }
}

const mapDispatch = (dispatch) => {
  return {
    handleCreatePair(session) {
      dispatch(createPairMiddleware(session));
    },
    handleAddSession(date, userId, start, end) {
      dispatch(addSessionMiddleware(date, userId, start, end))
    },
    loadSchedule () {
      dispatch (fetchSchedule())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticeSchedule))
