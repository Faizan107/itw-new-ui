import axios from 'axios';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getUsers = () => (dispatch) => {
    axios
        .get(`${baseUrl}/users`)
        .then(({ data }) => {
            dispatch({
                type: 'GET_USERS',
                payload: data.data
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addUser = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/users`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deleteUser = (id, refresh) => (dispatch) => {
    axios
        .delete(`${baseUrl}/users/${id}`)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateUser = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/users/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
