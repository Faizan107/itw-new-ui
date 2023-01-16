import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getPurchaseOrderReleaseByPartId = (partId) => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderReleaseInfo/parts/${partId}`)
        .then(({ data }) => {
            let response = data.PurchaseOrderReleaseInfo;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_POR',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
export const ReleaseOrderByVendorId = (vendorId) => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderReleaseInfo/vendor/${vendorId}`)
        .then(({ data }) => {
            let response = data.PurchaseOrderReleaseInfo;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_POR',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPurchaseOrderRelease = () => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderReleaseInfo`)
        .then(({ data }) => {
            console.log('getPurchaseOrderRelease', data);
            let response = data.PurchaseOrderReleaseInfo;
            let finalData = response ? objectToArray(response) : [];
            dispatch({
                type: 'GET_POR',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addPurchaseOrderRelease = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/purchaseOrderReleaseInfo`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deletePurchaseOrderRelease = (id, refresh) => (dispatch) => {
    axios
        .delete(`${baseUrl}/purchaseOrderReleaseInfo/${id}`)
        .then((rs) => {
            console.log('Testing Delete');

            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updatePurchaseOrderRelease = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/purchaseOrderReleaseInfo/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
