import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emitTextEvent } from './textarea-reducer'

class TextArea extends Component {
    constructor (props) {
        super (props);

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        console.log("triggered", e.target.value)
        this.props.emitText(e.target.value)
    }

    render () {
        return <textarea className="texty" value={this.props.text} onChange={this.handleChange}></textarea>
    }
}

const mapState = state => ({
    text: state.textarea
})

const mapDispatch = dispatch => ({
    emitText: text => {
        console.log("on text triggered", text);
        dispatch (emitTextEvent(text))
    }
})


export default connect (mapState, mapDispatch) (TextArea);