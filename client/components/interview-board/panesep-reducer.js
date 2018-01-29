export const EMIT_PANESEP_EVENT = 'EMIT_PANESEP_EVENT'
export const UPDATE_PANESEP_EVENT = 'UPDATE_PANESEP_EVENT';

export const emitPaneSepEvent = (topHeight, bottomHeight) => {
    return ({
        type: EMIT_PANESEP_EVENT,
        topHeight, bottomHeight
    })
}

export const updatePaneSep = (topHeight, bottomHeight) => {
    return ({
        type: UPDATE_PANESEP_EVENT,
        topHeight, bottomHeight
    })
}

const defaultState = {
    topHeight: 0,
    bottomHeight: 0
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_PANESEP_EVENT:
            return { topHeight: action.topHeight, bottomHeight: action.bottomHeight }
        default: return state;
    }
}