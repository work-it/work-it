import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateProfileThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Card, Icon } from 'semantic-ui-react'
import './user-profile-form.css'
import history from '../../'


class SchoolForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SchoolArr: [], // Array for holding added projects
      schoolName: '', // Project name we are currenlty entering
      startDate: '',
      endDate: '',
      degree:  '',
      editing: false, // Shows the pencil icon with the editProject function rather than the add icon with the addProjectfunction
      editingIdx: null // Keeps track of which project we are trying to edit
    }
  }

  // Grab the profile and update the ProjectsArr with what was previously saved to the db.
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
    const { schoolName, startDate, endDate, degree, SchoolArr } = this.state;
    const { prevClick } = this.props;

    return (
      <Card className="job-panel">
        <div className="schoolForm row">
        <div className = "col-sm-6">
          <h2>Profile Builder</h2>
        </div>
        <div className = "col-sm-6">
          <Button color="blue" size="big" className="save-button" floated="right" onClick={() => this.handleCompleteClick()}>Complete</Button>
          <Button color="black" size="big" className="save-button" floated="right" onClick={prevClick}>Prev</Button>
        </div>
        <div className = "col-sm-12">
          <hr />
          <h4> Step 6 - Add Your Education </h4>
        </div>

        <div className = "col-sm-6 row">
          <Form>
            <Input className="schoolName col-sm-12" placeholder="School Name" value={schoolName} onChange={(evt) => this.handleStringChange('schoolName', evt.target.value)} />

            <Input className="startDate col-sm-6" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate col-sm-6" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <TextArea className="degree col-sm-12" placeholder="Degree" value={degree} onChange={(evt) => this.handleStringChange('degree', evt.target.value)} />
            <div className = "col-sm-12">
              {
                this.state.editing ?
                <Button circular icon="pencil" className="add-btn" onClick={() => this.updateSchool()} /> :
                <Button circular icon="plus" className="add-btn" onClick={() => this.addSchool()} />
              }
            </div>
          </Form>
         </div>
         <div className = "col-sm-6">
           {
              /* Map over the pastEmployerArr and return all projects*/
              !!SchoolArr.length &&
              SchoolArr.map((school, idx) => {
                  return (
                  <Card key={school.schoolName + school.startDate + school.endDate}>
                    <Card.Content>
                      <Card.Header>
                        <span className="name">{school.schoolName} </span>
                      </Card.Header>
                      <Card.Meta>
                        <span className="location">{school.startDate + ' - ' + school.endDate}</span>
                      </Card.Meta>
                      <Card.Description>
                        <span className="location">{school.degree}</span>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Icon name="trash" className="remove-btn" onClick={() => this.removeSchool(idx)} />
                      <Icon name="pencil" className="edit-btn" onClick={() => this.editSchool(idx)} />
                      </Card.Content>
                  </Card>
                )
              })
            }
          </div>
        </div>
      </Card>
    )
  }

  removeSchool(idx) {
      // Get current projects array
      let currentSchoolArr = this.state.SchoolArr;

      const SchoolRemoved = currentSchoolArr.splice(idx, 1);
        //  update the projects array with the array with the project removed.
        this.setState({SchoolArr: currentSchoolArr});
      }

  editSchool(idx) {
    // Get current projectrs array
    let currentSchoolArr = this.state.SchoolArr;
    // Get the project we want to edit
    const school = currentSchoolArr[idx];
    // Update the form inputs to show project we are editing
    this.setState({schoolName: school.schoolName, startDate: school.startDate, endDate: school.endDate, degree: school.degree, editing: true, editingIdx: idx});
  }

  updateSchool() {
    // Get current projects array
    let currentSchoolArr = this.state.SchoolArr;
    // Update the info for the project we want to edit. editingIdx was saved on state at the time the edit button was clicked.
    currentSchoolArr[this.state.editingIdx].schoolName = this.state.schoolName;
    currentSchoolArr[this.state.editingIdx].startDate = this.state.startDate;
    currentSchoolArr[this.state.editingIdx].endDate = this.state.endDate;
    currentSchoolArr[this.state.editingIdx].degree = this.state.degree;
    // Update state with the edited project information AND reset the rest of the appropriate state values.
    this.setState({SchoolArr: currentSchoolArr, editing: false, editingIdx: null, schoolName: '', startDate: '', endDate: '', degree: ''});
  }

  addSchool() {
    // Get current projects array
    let currentSchoolArr = this.state.SchoolArr;
    currentSchoolArr.push({schoolName: this.state.schoolName, startDate: this.state.startDate, endDate: this.state.endDate, degree: this.state.degree})
      // Replace the projects array on the local state
      this.setState({SchoolArr: currentSchoolArr, schoolName: '', startDate: '', endDate: '', degree: ''});
  }

  handleCompleteClick() {
    // consolidate data and prepare it to be sent to the redux thunk.
    let data = { SchoolArr: this.state.SchoolArr };
    console.log(data)
    data.step = 1;
    // call the thunk to update profile in firebase
    this.props.handleProfileFormThunk(data);
    this.props.history.push('/profile');
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

export default connect(mapState, mapDispatch)(SchoolForm)
