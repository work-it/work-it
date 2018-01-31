import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import renderHTML from 'react-render-html';
import '../tile/tile.css'

class UserProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 0
    }
  }

  componentDidMount(){
    console.log("My props", this.props.emptyUser)
  }

  render() {
    const {view} = this.state;
    return (
      <div className="tile col-sm-3">
        {!view ? this.renderHomeView() : this.renderDescView()}
      </div>
    );
  }

  handleNextClick() {
    const {view, maxView} = this.state;
    if (view === maxView) {
      this.setState({view: 0})
    } else {
      this.setState({view: view + 1})
    }
  }

  handlePrevClick() {
    const {view, maxView} = this.state;
    if (view === 0) {
      this.setState({view: maxView})
    } else {
      this.setState({view: view - 1})
    }
  }

  renderHomeView() {
    console.log('render view', this.props)
    const {name, position, location, experience, type, salaryRange, imgUrl, topSkills} = this.props.defaultUsers[0];
    return (
      <Card>
        <div className="logo-wrapper">
          <Image className="logo" src={imgUrl} />
        </div>
        <Card.Content>
          <Card.Header>
            <span className="name">
              {name}
            </span>
            <span className="position">
              {position}
            </span>
          </Card.Header>
          <Card.Meta>
            <span className="location">
              {location}
            </span>
          </Card.Meta>
          <Card.Description>
            <span className="top-skills">
          {topSkills.map(skill => skill).join(', ')}
            </span>
            <span className="exp-type">
            {`${experience} - ${type}`}
            </span>
            <span className="range">
              {`$${salaryRange.min}K - $${salaryRange.max}K`}
            </span>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        <div className="prev" onClick={() => this.handlePrevClick()}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div className="btn-group-wrapper text-center">
          <Button.Group className="btn-group">
            <Button>View</Button>
            <Button>Apply</Button>
            <Button>Save</Button>
          </Button.Group>
        </div>
        <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        </Card.Content>
      </Card>
    )
  }

  roleDesc(roleArr){
    let rolesDesc = ''
    roleArr.forEach(function(elem, index) {
      rolesDesc+= '<h3> ' + elem.employerName + '</h3> <br> <h4> ' + elem.dateRange + '<h4><br><a href="' + elem.companyWebsite + '">'+ elem.companyWebsite + '</a>' + elem.workDesc
      if(index !== roleArr.length-1){rolesDesc+= '<hr>'}
    })
    return rolesDesc
  }

  projDesc(projArr){
    let projDesc = ''
    projArr.forEach(function(elem, index) {
      projDesc+= '<h3> ' + elem.projName + '</h3> <br> <h4> ' + elem.projDateRange + '<h4><br><a href="' + elem.projWebsite + '">'+ elem.projWebsite + '</a>' + elem.projDesc
      if(index !== projArr.length-1){projDesc+= '<hr>'}
    })
    return projDesc
  }

  eduDesc(eduArr){
    let eduDesc = ''
    eduArr.forEach(function(elem, index) {
      eduDesc+= '<h3> ' + elem.schoolName + '</h3> <br> <h4> ' + elem.schoolDateRange + '<h4><br><h5>' + elem.degree + '</h5>'
      if(index !== eduArr.length-1){eduDesc+= '<hr>'}
    })
    return eduDesc
  }

  renderDescView() {
    const {name, userDesc, pastEmployers, personalProjects, education} = this.props.defaultUsers[0];

    const {view} = this.state;

    let title
    let desc
    switch (view) {
      case 1:
        title = 'Company Description';
        desc = userDesc;
        break;
      case 2:
        title = 'Past Experience';
        desc = this.roleDesc(pastEmployers);
        break;
      case 3:
        title = 'Personal Projects';
        desc = this.projDesc(personalProjects);
        break;
      default:
        title = 'Education';
        desc = this.eduDesc(education);
    }

    return (
      <Card>
        <Image className="small-logo" src={this.props.imgUrl} />
        <Card.Content>
          <Card.Header>
          <span className="name">
              {name}
            </span>
            <span className="title">
              {title}
            </span>
          </Card.Header>
          <Card.Description>
            <span className="description">
              {renderHTML(desc)}
            </span>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        <div className="prev" onClick={() => this.handlePrevClick()}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div className="btn-group-wrapper text-center">
          <Button.Group className="btn-group">
            <Button>View</Button>
            <Button>Apply</Button>
            <Button>Save</Button>
          </Button.Group>
        </div>
        <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        </Card.Content>
      </Card>
    )
  }
}


const mapState = (state) => {
  return {
    emptyUser: state.UserProfileForm
  }
}

export default withRouter(connect(mapState)(UserProfileForm))
