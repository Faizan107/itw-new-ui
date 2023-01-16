const initialState = {
    prices: []
};

export default function priceReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_PRICE':
            return {
                ...state,
                prices: action.payload
            };
        case 'GET_VENDORS_PARTS':
            return {
                ...state,
                vendorParts: action.payload
            };
        default:
            return state;
    }
}
