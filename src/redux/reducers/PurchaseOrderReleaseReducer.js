const initialState = {
    porInfo: []
};

export default function purchaseOrderReleaseReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case 'GET_POR':
            return {
                ...state,
                porInfo: action.payload
            };
        default:
            return state;
    }
}
