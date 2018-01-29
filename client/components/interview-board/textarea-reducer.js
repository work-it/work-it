export const EMIT_TEXT_EVENT = 'EMIT_TEXT_EVENT'
export const UPDATE_TEXT_EVENT = 'UPDATE_TEXT_EVENT';

export const emitTextEvent = (text) => {
    return ({
        type: EMIT_TEXT_EVENT,
        text
    })
}

export const updateTextarea = (text) => {
    return ({
        type: UPDATE_TEXT_EVENT,
        text
    })
}

const defaultState = ''

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_TEXT_EVENT:
            return action.text
        default: return state;
    }
}