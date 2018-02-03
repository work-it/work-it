import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emitTextEvent, updateTextarea } from './textarea-reducer'
import { withRouter } from 'react-router-dom'

class TextArea extends Component {
    constructor (props) {
        super (props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        console.log("triggered", e.target.value)
        if (this.props.status==='pair_in_room') this.props.emitText(e.target.value)
        else this.props.updateText(e.target.value)
    }

    render () {
        console.log("Text in text area", this.props.text)
        return <textarea className="texty" value={this.props.text} onChange={this.handleChange}></textarea>
    }
}

const mapState = state => ({
    text: state.textarea,
    status: state.practice.practiceStatus
})

const mapDispatch = dispatch => ({
    emitText: text => {
        console.log("on text triggered", text);
        dispatch (emitTextEvent(text))
    },
    updateText: text => {
        dispatch(updateTextarea(text))
    }
})


export default withRouter(connect (mapState, mapDispatch) (TextArea));