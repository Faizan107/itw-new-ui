import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getPrice = () => (dispatch) => {
    axios
        .get(`${baseUrl}/priceInfo`)
        .then(({ data }) => {
            let response = data.PriceInfo;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_PRICE',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addPrice = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/priceInfo`, data)
        .then((rs) => {
            refresh();
            console.log('Set price', data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deletePrice = (id, refresh) => (dispatch) => {
    axios
        .delete(`${baseUrl}/priceInfo/${id}`)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updatePrice = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/priceInfo/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPartsByVendorId = (vendorId) => (dispatch) => {
    axios
        .get(`${baseUrl}/priceInfo/parts/vendor/${vendorId}`)
        .then(({ data }) => {
            
            dispatch({
                type: 'GET_VENDORS_PARTS',
                payload: data.PriceInfo
            });
        })
        .catch((err) => {
            console.log(err);
        });
};