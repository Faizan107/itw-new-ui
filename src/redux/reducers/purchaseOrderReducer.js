const initialState = {
    poInfo: []
};

export default function purchaseOrderReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_PO':
            return {
                ...state,
                poInfo: action.payload
            };
        default:
            return state;
    }
}
