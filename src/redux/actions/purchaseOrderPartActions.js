import axios from 'axios';
import { objectToArray } from '../../utils/index';
import { baseUrl as serverEnd } from '../../Config/config';
const baseUrl = `${serverEnd}/api`;

export const getPurchaseOrderPart = () => (dispatch) => {
    axios
        .get(`${baseUrl}/purchaseOrderPartsInfo`)
        .then(({ data }) => {
            dispatch({
                type: 'GET_POP',
                payload: data.PurchaseOrdersInfo
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addPurchaseOrderPart = (data, refresh) => (dispatch) => {
    axios
        .post(`${baseUrl}/purchaseOrderPartsInfo`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deletePurchaseOrderPart =
    (purchaseOrderPartId, refresh) => (dispatch) => {
        axios
            .delete(`${baseUrl}/purchaseOrderPartsInfo/${purchaseOrderPartId}`)
            .then((rs) => {
                refresh();
            })
            .catch((err) => {
                console.log(err);
            });
    };

export const updatePurchaseOrderPart = (id, data, refresh) => (dispatch) => {
    delete data.password;
    axios
        .patch(`${baseUrl}/purchaseOrderPartsInfo/${id}`, data)
        .then((rs) => {
            refresh();
        })
        .catch((err) => {
            console.log(err);
        });
};
