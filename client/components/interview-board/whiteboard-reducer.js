export const EMIT_DRAW_EVENT = 'EMIT_DRAW_EVENT'
export const UPDATE_DRAW_EVENT = 'UPDATE_DRAW_EVENT';

export const emitDrawEvent = (start, end, color) => {
    return ({
        type: EMIT_DRAW_EVENT,
        start, end, color
    })
}

export const updateWhiteboard = (start, end, color) => {
    return ({
        type: UPDATE_DRAW_EVENT,
        start, end, color
    })
}

const defaultState = {
    start: 0,
    end: 0,
    color: 'black'
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_DRAW_EVENT:
            return ({
                start: action.start,
                end: action.end,
                color: action.color
            })
        default: return state;
    }
}