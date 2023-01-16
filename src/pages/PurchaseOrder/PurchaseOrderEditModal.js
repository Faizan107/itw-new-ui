import React, {useState, useEffect} from 'react';
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
    addPurchaseOrder,
    getPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder
} from '../../redux/actions/purchaseOrderActions';
import { getPartsByVendorId } from '../../redux/actions/priceActions';
import { getVendors } from '../../redux/actions/vendorActions';
import { getParts } from '../../redux/actions/partsActions';
import { useDispatch, useSelector } from 'react-redux';


export const _selectOptions = [
	{ value: '1', text: 'vendor 1' },
	{ value: '2', text: 'vendor 2' },

];
export const _selectTimePeriodOptions = [
	{ value: '6', text: '6 month' },
	{ value: '12', text: '12 month' },
	{ value: '18', text: '18 month' },
	{ value: '24', text: '24 month' },
];

const PurchaseOrderEditModal = ({ id, isOpen, setIsOpen, list, isEdit }) => {
	const itemData = id ? list.filter((item) => item._id === id) : {};	const item = id ? itemData[0] : {};
	const [partFields, setPartFields] = useState([{ _partId: '', qty: '' }]);
    const [selectedVendorParts, setselectedVendorParts] = useState([]);

    const [vendor, setVendor] = useState('');
	const [vendorOptions, setVendorOptions] =  useState([]);
	const dispatch = useDispatch();

	useEffect(()=>{
		if (isEdit) {
			setVendor(item._vendorId);
		}
	}, [isEdit, item]);
	const handleInputChange = (index, event, name) => {
        const values = [...partFields];
        if (name === 'parts') {
            values[index]._partId = event.target.value;
        } else if (name === 'qty') {
            values[index].qty = event.target.value;
            // } else {
            //    values[index].remainingQty = event.target.value;
        }

        setPartFields(values);
    };

	useEffect(() => {
        dispatch(getPurchaseOrder());
        dispatch(getVendors());
        dispatch(getParts());
    }, []);
	const { poInfo } = useSelector((state) => state.purchaseOrderReducer);
    const { vendors } = useSelector((state) => state.vendorsReducer);
    const { parts } = useSelector((state) => state.partsReducer);
    const { vendorParts } = useSelector((state) => state.priceReducer);
	const refresh = () => {
		dispatch(getPurchaseOrder());
	};
	useEffect(() => {
        if (vendorParts) {
            const updateFields = [];
            Object.keys(vendorParts).map((keyName, i) => {
                updateFields.push({ _partId: vendorParts[keyName]._id, qty: '' })
            });
            setPartFields(updateFields);
            setselectedVendorParts(vendorParts)
        }
    }, [vendorParts]);

	useEffect(() => {
        if (vendors.length > 0) {
            const updatedVendors = [];
            vendors.map((v) => {updatedVendors.push({value: v._id, text: (v.firstName + ' ' + v.lastName)})
			})
			setVendorOptions(updatedVendors)
        }
    }, [vendors]);

    const renderParts = Object.keys(selectedVendorParts).map((keyName, i) => (
        <option
            key={i}
            value={selectedVendorParts[keyName]._id}>
            {selectedVendorParts[keyName].partName}
        </option>
    ));
	const formik = useFormik({
		enableReinitialize: true,

		initialValues: {
			vendor: item.vendor || '',
			purchaseDate: moment(item.purchaseDate).format(moment.HTML5_FMT.DATE) || '',
			purchaseOrderNumber: item.purchaseOrderNumber || '',
			purchaseTimePeriod: item.purchaseTimePeriod || '',
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => {
			let fields = partFields;
			for(let  part of fields){
				part['remainingQty'] = part.qty;
			};

			let formData = {
				vendor: vendor,
				purchaseDate: moment(values.purchaseDate).format(moment.HTML5_FMT.DATE),
				purchaseOrderNumber:values.purchaseOrderNumber.toString(),
				purchaseTimePeriod:values.purchaseTimePeriod,
				partFields: fields,
			};
			
			if (isEdit) {
				delete formData.purchaseOrderNumber;
				dispatch(updatePurchaseOrder(id, formData, refresh));
			} else {
				dispatch(addPurchaseOrder(formData, refresh));
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

	if (id || id === 0) {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{isEdit ? 'Update Purchase Order' : 'New Purchase Order'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup label='Vendor' name="vendor" className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Vendor'
									placeholder='Choose...'
									id="vendor"
									list={vendorOptions}
									onChange={(e) => {
										setVendor(e.target.value);
										setPartFields();
										dispatch(getPartsByVendorId(e.target.value));
									}}
									onBlur={formik.handleBlur}
									value={vendor}
								/>
								
							</InputGroup>
						</FormGroup>
						<FormGroup id='purchaseOrderNumber' label='Purchase Order Number' className='col-md-6'>
							<Input type='number' onChange={formik.handleChange} value={formik.values.purchaseOrderNumber} />
						</FormGroup>
						{ selectedVendorParts &&  Object.keys(selectedVendorParts).length > 0 && partFields &&  partFields.length &&
                            partFields.map((partField, index) => {
                                return (
                                    <React.Fragment
                                        key={`${partField}~${index}`}>
                                        <FormGroup className='col-md-6' label={"Parts"}>
                                            <Select
                                                labelId='demo-simple-select-label'
                                                id='demo-simple-select'
                                                value={partField._partId}
                                                label='Parts'
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        index,
                                                        e,
                                                        'parts'
                                                    );
                                                }}>
                                                    {renderParts}
                                            </Select>
                                            
                                        </FormGroup>
                                        <FormGroup className='col-md-6' label={"Quantity"}>
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
                                    </React.Fragment>
                                );
                            })}
						
						<FormGroup id='purchaseDate' label='Purchase Date' className='col-md-6'>
							<Input
								type='date'
								onChange={formik.handleChange}
								value={formik.values.purchaseDate}
								enabled
							/>
						</FormGroup>
						<FormGroup name="purchaseTimePeriod" label='Purchase Time Period' className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Default select example'
									placeholder='Choose...'
									list={_selectTimePeriodOptions}
									id="purchaseTimePeriod"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.purchaseTimePeriod}
								/>
								
							</InputGroup>
						</FormGroup>
						{/* <FormGroup id='email' label='Email' className='col-md-6'>
							<Input
								type='email'
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
						</FormGroup>
						<FormGroup id='membershipDate' label='Membership' className='col-md-6'>
							<Input
								type='date'
								onChange={formik.handleChange}
								value={formik.values.membershipDate}
								disabled
							/>
						</FormGroup>
						<FormGroup id='type' label='Type' className='col-md-6'>
							<Input
								onChange={formik.handleChange}
								value={formik.values.type}
								disabled
							/>
						</FormGroup>
						<FormGroup>
							<Label>Payout Type</Label>
							<ChecksGroup isInline>
								{Object.keys(PAYMENTS).map((i) => (
									<Checks
										type='radio'
										key={PAYMENTS[i].name}
										id={PAYMENTS[i].name}
										label={PAYMENTS[i].name}
										name='payoutType'
										value={PAYMENTS[i].name}
										onChange={formik.handleChange}
										checked={formik.values.payoutType}
									/>
								))}
							</ChecksGroup>
						</FormGroup>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='ReceiptLong'>
										<CardTitle>Billing Address</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='streetAddress'
											label='Address Line'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.streetAddress}
											/>
										</FormGroup>
										<FormGroup
											id='streetAddress2'
											label='Address Line 2'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.streetAddress2}
											/>
										</FormGroup>
										<FormGroup id='city' label='City' className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.city}
											/>
										</FormGroup>
										<FormGroup
											id='stateFull'
											label='State'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.stateFull}
											/>
										</FormGroup>
										<FormGroup id='zip' label='Zip' className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.zip}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div> */}
						{/* <div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='LocalShipping'>
										<CardTitle>Delivery Address</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='streetAddressDelivery'
											label='Address Line'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.streetAddressDelivery}
											/>
										</FormGroup>
										<FormGroup
											id='streetAddress2Delivery'
											label='Address Line 2'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.streetAddress2Delivery}
											/>
										</FormGroup>
										<FormGroup
											id='cityDelivery'
											label='City'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.cityDelivery}
											/>
										</FormGroup>
										<FormGroup
											id='stateFullDelivery'
											label='State'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.stateFullDelivery}
											/>
										</FormGroup>
										<FormGroup
											id='zipDelivery'
											label='Zip'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.zipDelivery}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div> */}
					</div>
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
