'use strict'

/**
 * Creates a whiteboard on the page that the user can scribble on.
 *
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Icon, Button } from 'semantic-ui-react'
import { emitDrawEvent, updateHistory, setAction } from './whiteboard-reducer'
import './interview-board.css'

class WhiteBoard extends Component {
    constructor (props) {
        super (props);
        // State
        this.canvas = null;
        this.ctx = null;
        //// Position tracking
        this.currentMousePosition = {x: 0, y: 0};
        this.lastMousePosition = {x: 0,y: 0};
        this.mouseClickedOnCanvas = false;
    }

    componentDidMount() {
        console.log("mounting whiteboard", this.props)
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.setupCanvas()
        const history = this.props.board.history
        if( history && history.length) {
            history.forEach (step => {
                this.draw(step.start, step.end, step.color, false, true, step.action)
            })
        }
    }

    // componentWillMount () {
    //     const board = this.props.board;
    //     if (board && board.start && board.end && board.color) {
    //         this.draw (board.start, board.end, board.color, false, true)
    //     }
    // }

    componentWillReceiveProps (newProps) {
        const board = newProps.board;
        //update if and only if it's the board that's changng, not the action
        if (newProps.action === this.props.action)
            if (board && board.start && board.end && board.color) {
                this.draw (board.start, board.end, board.color, false, true)
            }
    }

    // componentDidUpdate () {
    //     console.log("component did update")
    //     const board = this.props.board;
    //     if (board && board.start && board.end && board.color) {
    //         this.draw (board.start, board.end, board.color, false, true)
    //     }
    // }

    /**
     * Draw a line on the whiteboard.
     *
     * @param {[Number, Number]} start start point
     * @param {[Number, Number]} end end point
     * @param {String} strokeColor color of the line
     * @param {bool} shouldBroadcast whether to emit an event for this draw
     */
    draw(start, end, strokeColor='black', shouldBroadcast=true, skipPushHistory, action) {
        // Draw the line between the start and end positions
        // that is colored with the given color.
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        if (!action) action = this.props.action
        if (action === 'draw') {
            this.ctx.globalCompositeOperation='source-over'
            this.ctx.moveTo(...start);
            this.ctx.lineTo(...end);
            this.ctx.closePath();
            this.ctx.stroke();

        } else {
            this.ctx.globalCompositeOperation="destination-out";
            this.ctx.arc(...start,25,0,Math.PI*2,false);
            this.ctx.fill();
        }

        // If shouldBroadcast is truthy, we will emit a draw event to listeners
        // with the start, end and color data.
        shouldBroadcast && this.props.status==='pair_in_room' && this.props.emitDraw(start, end, strokeColor, this.props.action);
        //save history
        if (!skipPushHistory) this.props.pushHistory(start, end, strokeColor, this.props.action)
    }

    resize() {
        if (this.ctx) {
        // Unscale the canvas (if it was previously scaled)
            console.log(this.canvas.clientWidth, this.canvas.clientHeight)
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);

            // The device pixel ratio is the multiplier between CSS pixels
            // and device pixels
            const pixelRatio = window.devicePixelRatio || 1;

            // Allocate backing store large enough to give us a 1:1 device pixel
            // to canvas pixel ratio.
            const w = this.canvas.clientWidth * pixelRatio,
                h = this.canvas.clientHeight * pixelRatio;
                console.log(w, h)
            if (w !== this.canvas.width || h !== cthis.anvas.height) {
                // Resizing the canvas destroys the current content.
                // So, save it...
                const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

                this.canvas.width = w; this.canvas.height = h;

                // ...then restore it.
                this.ctx.putImageData(imgData, 0, 0)
            }

            // Scale the canvas' internal coordinate system by the device pixel
            // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
            // backing store is larger.
            this.ctx.scale(pixelRatio, pixelRatio);

            this.ctx.lineWidth = 5
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
        }
    }



    setupCanvas() {
        // Set the size of the canvas and attach a listener
        // to handle resizing.
        this.resize()
        this.canvas.addEventListener('resize', this.resize)
        this.canvas.addEventListener('mousedown', (function (e) {
            this.mouseClickedOnCanvas = true;
            this.currentMousePosition = [
                e.pageX - this.canvas.offsetLeft,
                e.pageY - this.canvas.offsetTop
            ]
        }).bind(this));

        this.canvas.addEventListener('mouseup', (function (e) {
            this.mouseClickedOnCanvas = false;
        }).bind(this))

        this.canvas.addEventListener('mousemove', (function (e) {
            if (!this.mouseClickedOnCanvas) return;
            if (!e.buttons) return;
            this.lastMousePosition = this.currentMousePosition
            this.currentMousePosition = [
                e.pageX - this.canvas.offsetLeft,
                e.pageY - this.canvas.offsetTop
            ]
            this.lastMousePosition && this.currentMousePosition &&
                this.draw(this.lastMousePosition, this.currentMousePosition, this.props.action==='draw'?'black':'white', true);
        }).bind(this));
    }

    render() {
        return (
          <div>
            {
              this.props.whiteboardAction === 'erase' ?
              <Button className="pencil-eraser-btn" onClick={() => this.props.toggleWhiteboardAction()}><Icon name="pencil"  /></Button> :
              <Button className="pencil-eraser-btn" onClick={() => this.props.toggleWhiteboardAction()}><Icon name="eraser"  /></Button>
            }
            <canvas id="canvas" className = "mycanvas" />
          </div>
        )
    }

}
const mapState = state => ({
    board: state.whiteboard,
    status: state.practice.practiceStatus,
    action: state.whiteboard.action,
    whiteboardAction: state.whiteboard.action
})

const mapDispatch = (dispatch) => ({
    emitDraw: (start, end, color, action) => {
        dispatch (emitDrawEvent(start, end, color, action))
    },
    pushHistory: (start, end, color, action) => {
        dispatch (updateHistory(start, end, color, action))
    },
    setWhiteboardAction: (action) => dispatch( setAction (action))
})

const mergeProps = (state, actions) => ({
  ...state,
  ...actions,
  toggleWhiteboardAction: () => {
      console.log("toggle triggered")
      if (state.whiteboardAction === 'draw')
          actions.setWhiteboardAction('erase')
      else
          actions.setWhiteboardAction('draw')
  }
})

export default withRouter(connect( mapState, mapDispatch, mergeProps)( WhiteBoard ));
