import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Dropdown, Card, Button} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import ScheduleDay from './schedule-day'
import './practice-schedule.css'
import {createPairMiddleware, addSessionMiddleware, fetchSchedule} from './practice-schedule-reducer'
import {times} from './times'
import { interviewApplicationThunk } from '../../store/index';

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
      const { schedule, handleAddSession, employerId, userId, isEmployer, appStatus} = this.props;
      const { startDate, daysToShow, selectedDate, selectedTimeStart, selectedTimeEnd } = this.state;
      const start = this.state.startDate.clone().format('MMM Do YYYY');
      const end = this.state.startDate.clone().add(6, 'days').format('MMM Do YYYY');

      console.log("employerId", employerId)
      const filterFunc = employerId?this.employerSchedFilter:this.userSchedFilter;
      return (
        <div className="practice-schedule">
          <Card className="schedule-wrapper">
            <h2 className="header">Available Times <small>{`(${start} - ${end})`}</small></h2>
            <div className="calendar-wrapper">
              {

                daysToShow.map(day => {
                  let sessions = schedule.filter(session => filterFunc(session, day, employerId))

                  return <ScheduleDay key={day.date} {...day} sessions={sessions} handleClick={this.handleSessionClick} />
                })
              }
            </div>
            <div className="calendar-nav">
              {(startDate.format('YYYYMMDD') !== moment().format('YYYYMMDD')) &&
              <Button className="prev-btn" size="large" color="blue" onClick={() => this.handlePrevClick()}>Prev Week</Button>}
              <Button className="next-btn" size="large" color="blue" onClick={() => this.handleNextClick()}>Next Week</Button>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <hr />
              </div>
            </div>
            <div className="form-wrapper row">
              <h2 className="header col-sm-12">Schedule A Time</h2>
              <p className="schedule-time-text col-sm-12">Scheduled practice sessions are 1 hour long. We will add 1 hour time blocks between your selected available start and end times.</p>
              <div className="col-sm-4">
                <DatePicker
                  className="date-picker"
                  selected={this.state.selectedDate}
                  onChange={this.handleDateSelect}
                />
              </div>
              <div className="col-sm-4">
                <Dropdown placeholder="Start Time" upward={true} className="time-start" fluid selection value={selectedTimeStart} options={times} onChange={(evt, { value }) => this.handleTimeSelect('selectedTimeStart', value)} />
              </div>
              <div className="col-sm-4">
                <Dropdown placeholder="End Time" upward={true} className="time-end" fluid selection value={selectedTimeEnd} options={times} onChange={(evt, { value }) => this.handleTimeSelect('selectedTimeEnd', value)} />
              <Button size="large" color="blue" className="add-time-btn" onClick={() => handleAddSession(selectedDate, selectedTimeStart, selectedTimeEnd, userId, isEmployer, appStatus)} >Add Time</Button>
              </div>
            </div>
          </Card>
        </div>
      )
    } else return <div>Must be logged in to see schedule</div>;
  }

  userSchedFilter (session, day) {
    return session.date === day.date
  }

  employerSchedFilter (session, day, employerId) {
    return session.date === day.date && session.userOne === employerId && session.intervieweeId
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
    if (type === 'available' || type=='interviewProposed') {
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
    isLoggedIn: !!state.user.id,
    isEmployer: !!state.user.employer,
    appStatus: state.applications[0].status
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleCreatePair(session) {
      dispatch(createPairMiddleware(session));
    },
    handleAddSession(date, start, end, intervieweeId, isEmployer, appStatus) {
      dispatch(addSessionMiddleware(date, start, end, intervieweeId))
      console.log('isEmployer', isEmployer, 'Status', appStatus);
      if (isEmployer && appStatus === 'review') {
        dispatch(interviewApplicationThunk())
      }
    },
    loadSchedule () {
      dispatch(fetchSchedule())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticeSchedule))
