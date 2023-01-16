const initialState = {
    pop: []
};

export default function purchaseOrderPartReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_POP':
            return {
                ...state,
                pop: action.payload
            };
        default:
            return state;
    }
}
