import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateProfileThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Icon, Card} from 'semantic-ui-react'
import './user-profile-form.css'


class PastEmployerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pastEmployersArr: [], // Array for holding added employers
      companyName: '', // Job name we are currenlty entering
      jobTitle: '',
      startDate: '',
      endDate: '',
      companyWebsite: '',
      workDesc:  '',
      editing: false, // Shows the pencil icon with the editPastEmployer function rather than the add icon with the addPastEmployer function
      editingIdx: null // Keeps track of which PastEmployer we are trying to edit
    }
  }

  // Grab the profile and update the pastEmployersArr with what was previously saved to the db.
  componentWillMount() {
    if (this.props.profile) {
      this.setState(this.props.profile);
    }
  }

  // Updates the local state when the inputs are updated.
  handleStringChange(key, val){
    this.setState({[key]: val})
  }


  render() {
    // Pull of all of the key/values from this.state and this.props to keep the code clean.
    const { companyName, jobTitle, startDate, endDate, companyWebsite, workDesc, pastEmployersArr } = this.state;
    const { prevClick } = this.props;

    return (
      <Card className="job-panel">
          <div className="PastEmployersForm row">

            {
              /* Map over the pastEmployerArr and return all pastEmpoyers*/
              !!pastEmployersArr.length &&
              pastEmployersArr.map((pastEmployer, idx) => {
                  return (
                  <ul key={pastEmployer.companyName + pastEmployer.startDate + pastEmployer.endDate}>
                    <li>
                      {`${pastEmployer.companyName}`}
                    </li>
                    <li>
                    {`${pastEmployer.jobTitle}`}
                    </li>
                    <li>{pastEmployer.startDate + ' - ' + pastEmployer.endDate} </li>
                    <li>
                      {`${pastEmployer.companyWebsite}`}
                    </li>
                    <li>
                      {`${pastEmployer.workDesc}`}
                    </li>
                    <li>
                      <Button circular icon="trash" className="remove-btn" onClick={() => this.removePastEmployer(idx)} />
                      <Button circular icon="pencil" className="edit-btn" onClick={() => this.editPastEmployer(idx)} />
                    </li>
                  </ul>
                )
              })
            }


          <Form>
            <Input className="companyName" placeholder="Company Name" value={companyName} onChange={(evt) => this.handleStringChange('companyName', evt.target.value)} />

            <Input className="jobTitle" placeholder="Job Title" value={jobTitle} onChange={(evt) => this.handleStringChange('jobTitle', evt.target.value)} />

            <Input className="startDate" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <Input className="companyWebsite" placeholder="Company Website" value={companyWebsite} onChange={(evt) => this.handleStringChange('companyWebsite', evt.target.value)} />

            <TextArea className="workDesc" placeholder="Description" value={workDesc} onChange={(evt) => this.handleStringChange('workDesc', evt.target.value)} />

            {
              /* If editing is true, show the pencil icon and call the updatePastEmployer function if the button is clicked
              * If editing is false, show the add icon and call the addPastEmployer function if the button is clicked
              */
              this.state.editing ?
              <Button circular icon="pencil" className="add-btn" onClick={() => this.updatePastEmployer()} /> :
              <Button circular icon="plus" className="add-btn" onClick={() => this.addPastEmployer()} />
            }
          </Form>
          {/* prevClick is a callback function passed down as props from the parent. It increments the step down by 1.*/}
          <Button onClick={prevClick}>Prev</Button>
          {/* handleNextClick takes care of calling the nextClick callback function passed down by the parent AND calls the redux thunk to save the info to the db. */}
          <Button onClick={() => this.handleNextClick()}>Next</Button>
        </div>
      </Card>
    )
  }

  removePastEmployer(idx) {
      // Get current jobs array
      let currentJobArr = this.state.pastEmployersArr;

      const JobRemoved = currentJobArr.splice(idx, 1);
        //  update the jobs array with the array with the job removed.
        this.setState({pastEmployersArr: currentJobArr});
      }

  editPastEmployer(idx) {
    // Get current jobs array
    let currentJobArr = this.state.pastEmployersArr;
    // Get the job we want to edit
    const job = currentJobArr[idx];
    // Update the form inputs to show job we are editing
    this.setState({companyName: job.companyName, jobTitle: job.jobTitle, startDate: job.startDate, endDate: job.endDate, companyWebsite: job.companyWebsite, workDesc: job.workDesc, editing: true, editingIdx: idx});
  }

  updatePastEmployer() {
    // Get current jobs array
    let currentJobArr = this.state.pastEmployersArr;
    // Update the info for the job we want to edit. editingIdx was saved on state at the time the edit button was clicked.
    currentJobArr[this.state.editingIdx].companyName = this.state.companyName;
    currentJobArr[this.state.editingIdx].jobTitle = this.state.jobTitle;
    currentJobArr[this.state.editingIdx].startDate = this.state.startDate;
    currentJobArr[this.state.editingIdx].endDate = this.state.endDate;
    currentJobArr[this.state.editingIdx].companyWebsite = this.state.companyWebsite;
    currentJobArr[this.state.editingIdx].workDesc = this.state.workDesc;
    // Update state with the edited job information AND reset the rest of the appropriate state values.
    this.setState({pastEmployersArr: currentJobArr, editing: false, editingIdx: null, companyName: '', jobTitle: '', startDate: '', endDate: '', companyWebsite: '', workDesc: ''});
  }

  addPastEmployer() {
    // Get current job array
    let currentJobArr = this.state.pastEmployersArr;
      currentJobArr.push({companyName: this.state.companyName, jobTitle: this.state.jobTitle, startDate: this.state.startDate, endDate: this.state.endDate, companyWebsite: this.state.companyWebsite, workDesc: this.state.workDesc})
      // Replace the jobs array on the local state
      this.setState({pastEmployersArr: currentJobArr, companyName: '', jobTitle: '', startDate: '', endDate: '', companyWebsite: '', workDesc: ''});
  }


  handleNextClick() {
    // increment the step in the parent
    this.props.nextClick();
    // consolidate data and prepare it to be sent to the redux thunk.
    let data = { pastEmployersArr: this.state.pastEmployersArr };
    data.step = this.props.step;
    // call the thunk to update profile in firebase
    this.props.handleProfileFormThunk(data);
  }
}

const mapState = (state) => {
  return {
    profile: state.profile // Get profile for updating the component on initial load.
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleProfileFormThunk(data) {
      dispatch(updateProfileThunk(data)) // Dispatch the thunk with the data for updating the db.
    }
  }
}

export default connect(mapState, mapDispatch)(PastEmployerForm)
