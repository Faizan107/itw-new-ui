import axios from 'axios';
import { baseUrl as serverEnd } from '../../Config/config';

const baseUrl = `${serverEnd}/api/auth`;

// const register = (username, email, password) => {
//   return axios.post(baseUrl + "signup", {
//     username,
//     email,
//     password,
//   });
// };

export const login =  (email, password) => (dispatch) => {
    return axios
        .post(baseUrl + '/login', {
            email,
            password
        })
        .then((response) => {
            console.log('Auth :', response);

             dispatch({
                type: 'GET_AUTH',
                payload: response,
             });
            //   if (response.data.accessToken) {
            //     localStorage.setItem("user", JSON.stringify(response.data));
            //   }

            //   return response.data;
        });
};

export const logout = () => {
    localStorage.removeItem('user');
};
