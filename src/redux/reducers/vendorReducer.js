const initialState = {
    vendors: []
};

export default function vendorsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_VENDORS':
            return {
                ...state,
                vendors: action.payload
            };
        case 'GET_VENDOR_ID':
            return {
                ...state,
                vendors: action.payload
            };
        default:
            return state;
    }
};
