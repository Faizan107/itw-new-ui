const initialState = {
    parts: []
};

export default function partsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_PARTS':
            return {
                ...state,
                parts: action.payload
            };
        case 'GET_PARTS_ID':
            return {
                ...state,
                parts: action.payload
            };
        default:
            return state;
    }
}
