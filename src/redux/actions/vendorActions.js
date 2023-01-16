import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getVendors = () => (dispatch) => {
    axios
        .get(`${baseUrl}/vendors`)
        .then(({ data }) => {
            let response = data.data;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_VENDORS',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getVendorById = () => (vendorId, refresh) => (dispatch) => {
    axios
        .get(`${baseUrl}/vendors/${vendorId}`)
        .then(({ data }) => {
            console.log('Vendor get: ', data.data);
            dispatch({
                type: 'GET_VENDOR_ID',
                payload: data.data
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addVendors = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/vendors`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deleteVendors = (id, refresh) => (dispatch) => {
    axios
        .delete(`${baseUrl}/vendors/${id}`)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateVendors = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/vendors/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
