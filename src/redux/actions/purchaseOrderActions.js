import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const PurchaseOrderByVendorId = (vendorId) => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderInfo/vendor/${vendorId}`)
        .then(({ data }) => {
            let response = data.data;
            let finalData = response.PurchaseOrderInfo;
            dispatch({
                type: 'GET_PO',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPurchaseOrderByPartId = (partId) => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderInfo/parts/${partId}`)
        .then(({ data }) => {
            let response = data.data;
            let finalData = response.PurchaseOrderInfo;
            dispatch({
                type: 'GET_PO',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPurchaseOrder = () => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderInfo`)
        .then(({ data }) => {
            let response = data.PurchaseOrdersInfo;
            let finalData = response ? objectToArray(response) : [];

            dispatch({
                type: 'GET_PO',
                payload: finalData
            });
        })
        .catch((err) => {
            console.log(err, 'error');
        });
};

export const addPurchaseOrder = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/purchaseOrderInfo`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deletePurchaseOrder =
    (purchaseOrderInfoId, refresh) => (dispatch) => {
        axios
            .delete(`${baseUrl}/purchaseOrderInfo/${purchaseOrderInfoId}`)
            .then((rs) => {
                refresh();
            })
            .catch((err) => {
                console.log(err);
            });
    };

export const updatePurchaseOrder = (id, data, refresh) => (dispatch) => {
    console.log('Update', data);
    delete data.password;
    axios
        .patch(`${baseUrl}/purchaseOrderInfo/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
