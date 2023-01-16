/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import moment from 'moment';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../components/bootstrap/Modal';
import data from '../../common/data/dummyCustomerData';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Label from '../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../common/data/enumPaymentMethod';
import InputGroup from '../../components/bootstrap/forms/InputGroup';
import Select from '../../components/bootstrap/forms/Select';
import {
    addPurchaseOrderRelease,
    getPurchaseOrderRelease,
    updatePurchaseOrderRelease,
    deletePurchaseOrderRelease
} from '../../redux/actions/purchaseOrderReleaseActions';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchaseOrder } from '../../redux/actions/purchaseOrderActions';
import { getParts } from '../../redux/actions/partsActions';
import { baseUrl as serverEnd } from '../../Config/config';

const baseUrl = `${serverEnd}/api`;

export const _selectPurchaseOrderNumberOptions = [
	{ value: '1', text: 'order 1' },
	{ value: '2', text: 'order 2' },
];
export const _selectStatusOptions = [
	{ value: 'Release Sent', text: 'Release Sent' },
	{ value: 'Release Accepted', text: 'Release Accepted' },
	{ value: 'Parts In Route', text: 'Parts In Route' },
	{ value: 'Parts Received', text: 'Parts Received' },
	{ value: 'Release Cancelled', text: 'Release Cancelled' },
];

const PurchaseOrderEditModal = ({ id, isOpen, setIsOpen, list, isEdit }) => {
	const itemData = id ? list.filter((item) => item._id === id) : {};
	const item = id ? itemData[0] : {};
    const [selectedOrderParts, setselectedOrderParts] = useState([]);

    const [partFields, setPartFields] = useState([
        { _partId: '', qty: '' }
    ]);
	const [vendorId, setVendorId] = useState('');
    const [purchaseOrderInfoId, setPurchaseOrderInfoId] = useState('');
    const [releaseDate, setReleaseDate] = useState('2022-01-01');
    const [expectedDeliveryDate, setExpectedDeliveryDate] =
        useState('2022-01-01');
    const [actualdDeliveryDate, setActualdDeliveryDate] =
        useState('2022-01-01');
    const [currentStatus, setCurrentStatus] = useState('');

	const dispatch = useDispatch();

	const refresh = () => {
		dispatch(getPurchaseOrderRelease());
	};
	useEffect(() => {
        dispatch(getPurchaseOrderRelease());
        dispatch(getPurchaseOrder());
        dispatch(getParts());
    }, []);
	useEffect(() => {
            let data =
                poInfo.length &&
                poInfo.filter((po) => {
                    return po._id === purchaseOrderInfoId;
                })[0]?.items;
            setPartFields(data);
    }, [purchaseOrderInfoId?.length > 0]);


	const { porInfo } = useSelector(
        (state) => state.purchaseOrderReleaseReducer
    );
    const { poInfo } = useSelector((state) => state.purchaseOrderReducer);
    const { parts } = useSelector((state) => state.partsReducer);

    const handleVendorId = (id) => {
		// console.log( e.target.id, "INSIDE", id, items, poId,e.target.vendorId, e, e.target._id);
		const purchaseOrder =  poInfo.filter(item =>  item._id == id);
		console.log("Purcha", purchaseOrder, poInfo)
        setVendorId(purchaseOrder[0]._vendorId);
        getPurchaseOrderById(id);
    };

    const getPurchaseOrderById = (Id) => {
        axios
            .get(`${baseUrl}/purchaseOrderInfo/${Id}`)
            .then(({ data }) => {
                let response = data.data;
                let updatedParts= [];
                    for(let item of response.PurchaseOrderInfo.items){
                        for(let part of parts){
                            if(item._partId == part._id){
                                item['partName'] = part.partName
                            }
                        }
                        updatedParts.push(item);
                    }
             setselectedOrderParts(updatedParts)
             const updateFields = [];
             updatedParts.map((val, i) => {
                 updateFields.push({ _partId: val._partId, qty: val.remainingQty || val.qty , remainingQty: val.remainingQty || val.qty })
             });

             setPartFields(updateFields);

            })
            .catch((err) => {
                console.log(err);
            });
    };
    const { vendorParts } = useSelector((state) => state.priceReducer);
    
    useEffect(() => {
        if (vendorParts) {
            const updateFields = [];
            Object.keys(vendorParts).map((keyName, i) => {
                updateFields.push({ _partId: vendorParts[keyName]._id, qty: '' })
            });
            setPartFields(updateFields);
        }
    }, [vendorParts]);

    const handleInputChange = (index, event, name) => {
        const values = [...partFields];
        if (name === 'parts') {
            values[index]._partId = event.target.value;
        } else {
            values[index].qty = event.target.value;
        }

        setPartFields(values);
    };
    // useEffect(()=>{
	// 	if (isEdit) {
	// 		setVendor(item._vendorId);
	// 	}
	// }, [isEdit, item]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			partName: item.partName || '',
			releaseDate: moment(item.releaseDate).format(moment.HTML5_FMT.DATE) || '',
			status: item.currentStatus || '',
		},
		onSubmit: (values) => {
            console.log("valuess", values)
			let formData = {
				_vendorId: vendorId,
				_purchaseOrderInfoId: purchaseOrderInfoId,
				partFields: partFields,
				releaseDate: moment(values.releaseDate).format(moment.HTML5_FMT.DATE),
				currentStatus: values.currentStatus,
			};
            if (isEdit) {
                delete formData._vendorId;
                dispatch(updatePurchaseOrderRelease(id, formData, refresh));
            } else {
                dispatch(addPurchaseOrderRelease(formData, refresh));
            }

			setIsOpen(false);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Updated Successfully</span>
				</span>,
				'Customer has been updated successfully',
			);
		},
	});
	const renderParts = selectedOrderParts.map((v, i) => (
        <option
                                                                key={i}
                                                                value={v._partId}>
                                                                {v.partName}
                                                            </option>
    ));
	if (id || id === 0) {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{isEdit ? 'Update New Purchase Order Release' : 'New Purchase Order Release'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
						<FormGroup label='Purchase Order Number' className='col-md-6'>								
								 <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={purchaseOrderInfoId}
                                label='Purchase Order Info'
                                onChange={(e) => {
                                    setPurchaseOrderInfoId(e.target.value);
									handleVendorId(
										e.target.value
									)
                                }}>
                                {Object.keys(poInfo).map((key, i) => (
                                        <option
                                            value={poInfo[key]._id}
                                            key={i}
											vendorId={poInfo[key]._vendorId}
											items={poInfo[key].items}
											_id ={poInfo[key]._id}
											>
                                            {poInfo[key].purchaseOrderNumber}
                                        </option>
                                    )
                                )}
                            </Select>
						</FormGroup>
						<FormGroup id='releaseDate' label='Release Date' className='col-md-6'>
							<Input
								type='date'
								onChange={formik.handleChange}
								value={formik.values.releaseDate}
								enabled
							/>
						</FormGroup>
						{ partFields && partFields.length &&
                            partFields.map((partField, index) => {
                                return (
                                    <React.Fragment
                                        key={`${partField}~${index}`}>
										<FormGroup className='col-md-12' style={{ display:"flex"}}>
                                        <FormGroup className='col-md-6' label={"Parts"}>
                                            <Select
                                                labelId='demo-simple-select-label'
                                                id='demo-simple-select'
                                                value={partField._partId}
                                                label='Parts'
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        e,
                                                        'parts'
                                                    )
                                                }>
                                                
                                                { renderParts }
                                            </Select>
                                        </FormGroup>
                                        <FormGroup className='col-md-3' style={{ paddingInline: "5px" }} label={"Quantity"}>
                                        <Input
                                            className='add-user-field py-2'
                                            id='outlined-basic'
                                            label='Quantity'
                                            type='number'
                                            variant='outlined'
                                            value={partField.qty}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    e,
                                                    'qty'
                                                )
                                            }
                                        />
                                        </FormGroup>
                                        <FormGroup className='col-md-3' label={"Remaining Qty"}>
                                        <Input
                                            className='add-user-field py-2'
                                            id='outlined-basic'
                                            label='Remaining Quantity'
                                            type='number'
                                            variant='outlined'
                                            value={partField.remainingQty}
                                            readOnly
                                            disables
                                        />
                                        </FormGroup>
										</FormGroup>
                                    </React.Fragment>
                                );
                            })}
						<FormGroup label='Status' name="currentStatus" className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='select'
									placeholder='Choose...'
									list={_selectStatusOptions}
									id="currentStatus"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.currentStatus}
								/>
							</InputGroup>
						</FormGroup>

						
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={formik.handleSubmit}>
						Save
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
	return null;
};
PurchaseOrderEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default PurchaseOrderEditModal;
