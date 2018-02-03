export const EMIT_DRAW_EVENT = 'EMIT_DRAW_EVENT'
export const UPDATE_DRAW_EVENT = 'UPDATE_DRAW_EVENT';
export const CLEAR_WHITEBOARD = 'CLEAR_WHITEBOARD'
export const UPDATE_HISTORY = 'UPDATE_HISTORY'
export const emitDrawEvent = (start, end, color) => {
    return ({
        type: EMIT_DRAW_EVENT,
        start, end, color
    })
}

export const clearWhiteboard = () => {
    return ({
        type: CLEAR_WHITEBOARD
    })
}

export const updateWhiteboard = (start, end, color) => {
    return ({
        type: UPDATE_DRAW_EVENT,
        start, end, color
    })
}

export const updateHistory = (start, end, color) => {
    return ({
        type: UPDATE_HISTORY,
        start, end, color
    })
}

const defaultState = {
    start: 0,
    end: 0,
    color: 'black',
    history: []
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_DRAW_EVENT: //this triggeres update in middleware
        case UPDATE_HISTORY: //this does not
            const event = {
                start: action.start,
                end: action.end,
                color: action.color
            }
            return ({...event, history: [...state.history, event]})
        case CLEAR_WHITEBOARD:
            return defaultState;
        default: return state;
    }
}