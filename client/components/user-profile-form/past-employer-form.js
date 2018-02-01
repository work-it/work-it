import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Input, TextArea, Button} from 'semantic-ui-react'
import './user-profile-form.css'


class PastEmployerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employerName: '',
      startDate: '',
      endDate: '',
      companyWebsite: '',
      workDesc:  ''
      }
  }


  handleStringChange(key, val){
    this.setState({[key]:val})
  }


  render() {
    const { employerName, startDate, endDate, companyWebsite, workDesc } = this.state;
    const {nextClick, prevClick} = this.props;

    return (
      <div className="PastEmployerForm row">
          <Form>
            <Input className="employerName" placeholder="Employer Name" value={employerName} onChange={(evt) => this.handleStringChange('employerName', evt.target.value)} />

            <Input className="startDate" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <Input className="companyWebsite" placeholder="Company Website" value={companyWebsite} onChange={(evt) => this.handleStringChange('companyWebsite', evt.target.value)} />

            <TextArea className="workDesc" placeholder="Job Description" value={workDesc} onChange={(evt) => this.handleStringChange('workDesc', evt.target.value)} />

            <Button circular icon="plus" className="add-btn" onClick={() => this.addExperience()} />
          </Form>
          <Button onClick={prevClick}>Prev</Button>
          <Button onClick={nextClick}>Next</Button>
      </div>
    )
  }
}

export default PastEmployerForm
