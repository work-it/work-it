export const EMIT_TEXT_EVENT = 'EMIT_TEXT_EVENT'
export const UPDATE_TEXT_EVENT = 'UPDATE_TEXT_EVENT';
export const CLEAR_TEXTAREA = 'CLEAR_TEXTAREA'
export const SET_TEXTAREA = 'SET_TEXTAREA'
export const emitTextEvent = (text) => {
    return ({
        type: EMIT_TEXT_EVENT,
        text
    })
}

export const clearTextarea = () => {
    return ({
        type: CLEAR_TEXTAREA
    })
}

export const updateTextarea = (text) => {
    return ({
        type: UPDATE_TEXT_EVENT,
        text
    })
}

export const setTextarea = text => {
    return ({
        type: SET_TEXTAREA,
        text
    })
}

const defaultState = ''

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_TEXT_EVENT:
            return action.text
        case CLEAR_TEXTAREA:
            return defaultState;
        case SET_TEXTAREA:
            return action.text
        default: return state;
    }
}