import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loadJobThunk} from '../../store'
import renderHTML from 'react-render-html';
import {Grid, Image, Button, Header, TextArea, Divider} from 'semantic-ui-react'
class JobView extends Component {
    constructor (props) {
        super (props);
    }
    componentDidMount () {
        console.log("props", this.props)
        if (!this.props.job && this.props.match && this.props.match.params)
            this.props.fetchJob(this.props.match.params.id);
    }

    render () {
       if (!this.props.job) return null;

       console.log('props', this.props)

       const {comp, companyDesc, employerId, experience, imgUrl, location, name, position, qualifications, roleDesc, salaryRange, savedBy, topSkills, type, zip} = this.props.job

        return (

            <Grid relaxed='very' columns={12}>

                <Grid.Row>
                    <Grid.Column width={4}>
                        <Image src={imgUrl} />
                    </Grid.Column>
                    <Grid.Column width={8}>

                            <Grid.Row>
                                <Grid.Column width={8}><Header size='large'>{name}</Header></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Header size='medium'>{position}</Header></Grid.Column>
                                <Grid.Column width={4}><Header textAlign='right' size='small'>{location}</Header></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><div>{type}</div></Grid.Column>
                                <Grid.Column width={4}><div>{`$${salaryRange.min}K - $${salaryRange.max}K`}</div></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <div style={{width: '100%'}}>{renderHTML(companyDesc)}</div>
                                </Grid.Column>
                            </Grid.Row>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                <Grid.Column width={4}>
                    <Button fluid>Apply</Button>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Button fluid>Save</Button>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row><Grid.Column width={12}><Divider/></Grid.Column></Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><Header textAlign='center' size='large'>Role Description</Header></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><div>{renderHTML(roleDesc)}</div></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><Header textAlign='center' size='large'>Qualificatons</Header></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><div>{renderHTML(qualifications)}</div></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><Header textAlign='center' size='large'>Benefits</Header></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={12}><div>{renderHTML(comp)}</div></Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }
}

const mapState = state => ({
    jobs: state.jobs
})

const mapDispatch = (dispatch) => ({
    fetchJob: (id) => dispatch (loadJobThunk(id))
})


const mergeProps = (state, actions, ownProps) => ({
    ...state,
    ...actions,
    ...ownProps,
    job: state.jobs?state.jobs.find (job => job.id = ownProps.match.params.id):null
})

export default withRouter (connect (mapState, mapDispatch, mergeProps) (JobView))
