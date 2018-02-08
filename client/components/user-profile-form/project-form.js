import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateProfileThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Icon, Card} from 'semantic-ui-react'
import './user-profile-form.css'


class ProjectsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ProjectsArr: [], // Array for holding added projects
      projectName: '', // Project name we are currenlty entering
      startDate: '',
      endDate: '',
      projectWebsite: '',
      projectDesc:  '',
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
    const { projectName, startDate, endDate, projectWebsite, projectDesc, ProjectsArr } = this.state;
    const { prevClick } = this.props;

    return (
      <Card className="job-panel">
      <div className="projectForm row">
        <div className = "col-sm-6">
          <h2>Profile Builder</h2>
        </div>
        <div className = "col-sm-6">
          <Button color="blue" size="big" className="save-button" floated="right" onClick={() => this.handleNextClick()}>Next</Button>
          <Button color="black" size="big" className="save-button" floated="right" onClick={prevClick}>Prev</Button>
        </div>
        <div className = "col-sm-12">
          <hr />
          <h4> Step 5 - Add Your Projects </h4>
        </div>
        <div className = "col-sm-6 row">
          <Form>
            <Input className="projectName col-sm-12" placeholder="Project Name" value={projectName} onChange={(evt) => this.handleStringChange('projectName', evt.target.value)} />

            <Input className="startDate col-sm-6" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate col-sm-6" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <Input className="projectWebsite col-sm-12" placeholder="Project Website" value={projectWebsite} onChange={(evt) => this.handleStringChange('projectWebsite', evt.target.value)} />

            <TextArea className="projectDesc col-sm-12" placeholder="Description" value={projectDesc} onChange={(evt) => this.handleStringChange('projectDesc', evt.target.value)} />
            <div className = "col-sm-12">
              {
                this.state.editing ?
                <Button circular icon="pencil" className="add-btn" onClick={() => this.updateProject()} /> :
                <Button circular icon="plus" className="add-btn" onClick={() => this.addProject()} />
              }
            </div>
          </Form>
        </div>
        <div className = "col-sm-6">
          {
            /* Map over the pastEmployerArr and return all projects*/
            !!ProjectsArr.length &&
            ProjectsArr.map((project, idx) => {
                return (
                <Card key={project.projectName + project.startDate + project.endDate}>
                <Card.Content>
                  <Card.Header>
                    <span className="name">{project.projectName} </span>
                  </Card.Header>
                  <Card.Meta>
                    <span className="location">{project.startDate + ' - ' + project.endDate}</span>
                    <span className="location">{project.projectWebsite}</span>
                  </Card.Meta>
                  <Card.Description>
                    <span className="location">{project.projectDesc}</span>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name="trash" className="remove-btn" onClick={() => this.removeProject(idx)} />
                    <Icon name="pencil" className="edit-btn" onClick={() => this.editProject(idx)} />
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

  removeProject(idx) {
      // Get current projects array
      let currentProjectArr = this.state.ProjectsArr;

      const ProjectRemoved = currentProjectArr.splice(idx, 1);
        //  update the projects array with the array with the project removed.
        this.setState({ProjectsArr: currentProjectArr});
      }

  editProject(idx) {
    // Get current projectrs array
    let currentProjectArr = this.state.ProjectsArr;
    // Get the project we want to edit
    const project = currentProjectArr[idx];
    // Update the form inputs to show project we are editing
    this.setState({projectName: project.projectName, startDate: project.startDate, endDate: project.endDate, projectWebsite: project.projectWebsite, projectDesc: project.projectDesc, editing: true, editingIdx: idx});
  }

  updateProject() {
    // Get current projects array
    let currentProjectArr = this.state.ProjectsArr;
    // Update the info for the project we want to edit. editingIdx was saved on state at the time the edit button was clicked.
    currentProjectArr[this.state.editingIdx].projectName = this.state.projectName;
    currentProjectArr[this.state.editingIdx].startDate = this.state.startDate;
    currentProjectArr[this.state.editingIdx].endDate = this.state.endDate;
    currentProjectArr[this.state.editingIdx].projectWebsite = this.state.projectWebsite;
    currentProjectArr[this.state.editingIdx].projectDesc = this.state.projectDesc;
    // Update state with the edited project information AND reset the rest of the appropriate state values.
    this.setState({ProjectsArr: currentProjectArr, editing: false, editingIdx: null, projectName: '', startDate: '', endDate: '', projectWebsite: '', projectDesc: ''});
  }

  addProject() {
    // Get current projects array
    let currentProjectArr = this.state.ProjectsArr;
    currentProjectArr.push({projectName: this.state.projectName, startDate: this.state.startDate, endDate: this.state.endDate, projectWebsite: this.state.projectWebsite, projectDesc: this.state.projectDesc})
      // Replace the projects array on the local state
      this.setState({ProjectsArr: currentProjectArr, projectName: '', startDate: '', endDate: '', projectWebsite: '', projectDesc: ''});
  }


  handleNextClick() {
    // increment the step in the parent
    this.props.nextClick();
    // consolidate data and prepare it to be sent to the redux thunk.
    let data = { ProjectsArr: this.state.ProjectsArr };
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

export default connect(mapState, mapDispatch)(ProjectsForm)
