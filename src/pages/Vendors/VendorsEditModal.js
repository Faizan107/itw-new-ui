import React, { useState, useEffect } from 'react';
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
import {
    addVendors,
    getVendors,
    updateVendors
} from '../../redux/actions/vendorActions';
import { useDispatch, useSelector } from 'react-redux';

const VendorEditModal = ({ id, isOpen, setIsOpen, list, isEdit }) => {
	const itemData = id ? list.filter((item) => item._id === id ) : {};
	const item = id ? itemData[0] : {};
	const [status, setStatus] = useState(false);
	const dispatch = useDispatch();

	const refresh = () => {
		dispatch(getVendors());
	};
	useEffect(()=>{
		if (isEdit) {
		setStatus(item.active);
		}
	}, [isEdit, item]);

	const formik = useFormik({
		enableReinitialize: true,

		initialValues: {
			firstName: item.firstName || '',
			lastName: item.lastName || '',
			email: item.email || '',
			street: item.street || '',
			city: item.city || '',
			state: item.state || '',
			postal_code: item.postal_code || '',
			status: item.status || false,
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => {
			let formData = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				street: values.street,
				city: values.city,
				state: values.state,
				postal_code: values.postal_code,
				active: status
			};

			if (isEdit) {
						dispatch(updateVendors(id, formData, refresh));
					} else {
						dispatch(addVendors(formData, refresh));
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
					<ModalTitle id={id}>{item.name || 'New Vendor'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup id='firstName' label='Company Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.firstName} />
						</FormGroup>
						<FormGroup id='lastName' label='Contact Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.lastName} />
						</FormGroup>
						<FormGroup id='email' label='Email' className='col-md-6'>
							<Input
								type='email'
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
						</FormGroup>
						<FormGroup id='street' label='Street' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.street} />
						</FormGroup>
						<FormGroup id='city' label='City' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.city} />
						</FormGroup>
						<FormGroup id='state' label='State' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.state} />
						</FormGroup>
						<FormGroup id='postal_code' label='Postal Code' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.postal_code} />
						</FormGroup>
						<FormGroup label={ status ? 'Active' : 'Inactive'} className='col-md-6'>
							<Icon
								onClick={(e) => {
									setStatus(!status);
								}}
								size='3x'
								icon={status ? 'ToggleOn' : 'ToggleOff'}
								color={status ? 'success' : null}
								className='navigation-icon'
							/>
						</FormGroup>
						{/* <FormGroup id='membershipDate' label='Membership' className='col-md-6'>
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
VendorEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default VendorEditModal;
