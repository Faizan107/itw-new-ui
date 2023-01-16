import React, { useEffect, useState } from 'react';
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
    addPrice,
    getPrice,
    updatePrice,
    deletePrice
} from '../../redux/actions/priceActions';
import { getParts, getPartsById } from '../../redux/actions/partsActions';
import { getVendors } from '../../redux/actions/vendorActions';

import { useDispatch, useSelector } from 'react-redux';

export const _selectPartOptions = [
	{ value: '1', text: 'product 1' },
	{ value: '2', text: 'product 2' },
];
export const _selectVendorOptions = [
	{ value: '1', text: 'vendor 1' },
	{ value: '2', text: 'vendor 2' },
];

const PricingEditModal = ({ id, isOpen, setIsOpen, list, isEdit }) => {
	const itemData = id ? list.filter((item) => item._id === id) : {};
	const item = id ? itemData[0] : {};
	console.log("itesm---", item)
	const dispatch = useDispatch();

	const refresh = () => {
		dispatch(getPrice());
	};
	useEffect(() => {
        dispatch(getPrice());
        dispatch(getParts());
        dispatch(getVendors());
    }, []);
    const { prices } = useSelector((state) => state.priceReducer);
    const { vendors } = useSelector((state) => state.vendorsReducer);
    const { parts } = useSelector((state) => state.partsReducer);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			_partId: item._partId || '',
			_vendorId: item._vendorId || '',
			price: item.price || '',
		},
		onSubmit: (values) => {
			let formData = {
				_partId: values._partId,
				_vendorId: values._vendorId,
				price: values.price.toString() || '',
			};

			if (isEdit) {
				dispatch(updatePrice(id, formData, refresh));
			} else {
				dispatch(addPrice(formData, refresh));
				refresh();
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
					<ModalTitle id={id}>{isEdit ? 'Update Price' : 'New Price'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup  name="part" label='Part' className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Default select example'
									placeholder='Choose...'
									list={_selectPartOptions}
									id="part"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values._partId}
								>
								{parts.map((key) => {
                                    return (
                                        <option key={''} value={key._id}>
                                            {key.partName}
                                        </option>
                                    );
                                })}
								</Select>
							</InputGroup>
						</FormGroup>
						<FormGroup name="vendor" label='Vendor' className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Default select example'
									placeholder='Choose...'
									list={_selectVendorOptions}
									id="vendor"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values._vendorId}
								>
								  {vendors.length > 0 &&
                                    vendors.map((v) => {
                                        return (
                                            <option key={''} value={v._id}>
                                                {v.firstName + ' ' + v.lastName}
                                            </option>
                                        );
                                    })}
                            </Select>
							</InputGroup>
						</FormGroup>
						<FormGroup id='price' label='Price Per Piece' className='col-md-6'>
							<Input type='number' onChange={formik.handleChange} value={formik.values.price} />
						</FormGroup>
						{/* <FormGroup id='name' label='Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.name} />
						</FormGroup>
						<FormGroup id='email' label='Email' className='col-md-6'>
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
						</div>
						<div className='col-md-6'>
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
PricingEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default PricingEditModal;
