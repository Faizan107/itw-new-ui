import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getParts = () => (dispatch) => {
    axios
        .get(`${baseUrl}/parts`)
        .then(({ data }) => {
            let response = data.data;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_PARTS',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPartsById = () => (partId, refresh) => (dispatch) => {
    axios
        .get(`${baseUrl}/parts/${partId}`)
        .then(({ data }) => {
            console.log('Parts get: ', data.data);
            dispatch({
                type: 'GET_PARTS_ID',
                payload: data.data
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addParts = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/parts`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deleteParts = (id, refresh) => (dispatch) => {
    axios
        .delete(`${baseUrl}/parts/${id}`)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateParts = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/parts/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
