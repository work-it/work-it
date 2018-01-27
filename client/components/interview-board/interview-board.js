import React, { Component } from 'react'
//import SplitPane from './SplitPane'
import './interview-board.css'
//import { TextArea } from 'semantic-ui-react'
//import {Editor, EditorState} from 'draft-js'

export default class InterviewBoard extends Component {
    constructor (props) {
        super (props);
        //this.state = {editorState: EditorState.createEmpty()};
        //this.onChange = (editorState) => this.setState({editorState});
    }

    componentDidMount () {
        const c = document.getElementById('canvas');
        const ctx = c.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("Hello World",10,50);
    }
    
    render () {

        
        return (
            <div className='outer'>
                <div className='editor'>
                    <textarea className='textArea' placeholder='someText'></textarea>
                </div>
                <div className='canvas'><canvas id='canvas'></canvas></div>
            </div>
        )
    }
}
