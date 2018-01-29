'use strict'

/**
 * Creates a whiteboard on the page that the user can scribble on.
 *
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emitDrawEvent } from './whiteboard-reducer'
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
        this.currentImage = 'pencil'
    }

    componentDidMount() {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.setupCanvas()
    }

    componentDidUpdate () {
        const board = this.props.board;
        if (board && board.start && board.end && board.color) {
            this.draw (board.start, board.end, board.color, false)
        }
    }

    /**
     * Draw a line on the whiteboard.
     *
     * @param {[Number, Number]} start start point
     * @param {[Number, Number]} end end point
     * @param {String} strokeColor color of the line
     * @param {bool} shouldBroadcast whether to emit an event for this draw
     */
    draw(start, end, strokeColor='black', shouldBroadcast=true) {
        // Draw the line between the start and end positions
        // that is colored with the given color.
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.moveTo(...start);
        this.ctx.lineTo(...end);
        this.ctx.closePath();
        this.ctx.stroke();
    
        // If shouldBroadcast is truthy, we will emit a draw event to listeners
        // with the start, end and color data.
        shouldBroadcast && this.props.emitDraw(start, end, strokeColor);
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

    drawImage () {
        let imgUrl;
        if (this.currentImage === 'pencil') {
            imgUrl = 'http://localhost:8080/pencil.png'
        } else {
            imgUrl = 'http://localhost:8080/eraser.jpg'
        }

        const img = new Image();
        img.src = imgUrl;
        img.onload = function () {
            this.ctx.drawImage(img, 25,25);
        }
    }

    setupCanvas() {
        // Set the size of the canvas and attach a listener
        // to handle resizing.
        this.resize()
        this.drawImage()
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
                this.draw(this.lastMousePosition, this.currentMousePosition, 'black', true);
        }).bind(this));
    }

    render() {
        return <canvas id='canvas' className = "mycanvas"></canvas>
    }
    
}
const mapState = state => ({
    board: state.whiteboard
})

const mapDispatch = (dispatch) => ({
    emitDraw: (start, end, color) => {
        dispatch (emitDrawEvent(start, end, color))
    }
})
export default connect( mapState, mapDispatch)( WhiteBoard );