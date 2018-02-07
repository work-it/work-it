import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import renderHTML from 'react-render-html';
import '../tile/tile.css'

class UserTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 0,
      maxView: 4,
    }
  }

  componentDidMount () {
    if (this.props.fixedView) {
      this.setState({view:this.props.initView, maxView:4})
    }
  }

  render() {
    const {view} = this.state;
    return (
      <div className="tile">
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
    console.log(this.props)
    const {name, position, location, experience, type, employer, minSalary, maxSalary, imgUrl, skillsArr, handleViewClick, appId, jobId, status} = this.props;
    return (
      <Card>
        {status === 'apply' && employer && <div className="new">New</div>}
        <div className="logo-wrapper">
          <Image className="logo" src={imgUrl} />
        </div>
        <Card.Content >
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
          {skillsArr&& skillsArr
            .filter(skill => skill.topSkill === true)
            .map(skill => skill.name).join(', ')}
            </span>
            <span className="exp-type">
            {`${experience} - ${type}`}
            </span>
           { !this.props.fixedView? <span className="range">
              {`$${minSalary}K - $${maxSalary}K`}
            </span>:null }
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        {
          !this.props.fixedView? (
            <div className="prev" onClick={() => this.handlePrevClick()}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>) : null
        }
        <div className="btn-group-wrapper text-center">
        {
          this.props.footer?<Button onClick={(e)=>{
            e.preventDefault();
            this.props.footer();
          }}>{this.props.footerText}</Button>:
          <Button onClick={() => handleViewClick(appId, jobId)}>View Application</Button>
        }

        </div>

        {
          !this.props.fixedView? (
           <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>):null
          }
        </Card.Content>
      </Card>
    )
  }

  roleDesc(roleArr){
    let rolesDesc = ''
    roleArr.forEach(function(elem, index) {
      rolesDesc+= '<h3> ' + elem.companyName + '</h3><a href="' + elem.companyWebsite + '">'+ elem.companyWebsite + '</a> <h4>' + elem.jobTitle + '</h4> <h4> ' + elem.startDate + '-' + elem.endDate + '<h4> <p>' + elem.workDesc + '</p>'
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
    const {name, userDesc, pastEmployersArr, employer, status, ProjectsArr, SchoolArr, appId, jobId, handleViewClick} = this.props;

    const {view} = this.state;

    let title
    let desc
    switch (view) {
      case 1:
        title = 'Summary';
        desc = userDesc;
        break;
      case 2:
        title = 'Past Experience';
        desc = this.roleDesc(pastEmployersArr);
        break;
      case 3:
        title = 'Personal Projects';
        desc = this.projDesc(ProjectsArr);
        break;
      default:
        title = 'Education';
        desc = this.eduDesc(SchoolArr);
    }

    return (
      <Card>
        <Image className="small-logo" src={this.props.imgUrl} />
        {status === 'apply' && <div className="new">New</div>}
        <Card.Content className="content-sub-view">
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
            <Button onClick={() => handleViewClick(appId, jobId)}>View Application</Button>
        </div>
        <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        </Card.Content>
      </Card>
    )
  }
}

export default UserTile
