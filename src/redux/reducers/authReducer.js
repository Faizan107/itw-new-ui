const initialState = {
    auth: {
        status: 404,
    }
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_AUTH':
            return {
                ...state,
                auth: action.payload
            };
        default:
            return state;
    }
}
