/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../components/bootstrap/Modal';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import InputGroup from '../../components/bootstrap/forms/InputGroup';
import Select from '../../components/bootstrap/forms/Select';
import { addParts, getParts, updateParts } from '../../redux/actions/partsActions';

export const _selectOptions = [
	{ value: 'InStock', text: 'In Stock' },
	{ value: 'OutStock', text: 'Out Stock' },
];

const ProductEditModal = ({ id, isOpen, setIsOpen, list, isEdit }) => {
	const itemData = id ? list.filter((item) => item._id === id) : {};
	const item = id ? itemData[0] : {};

	const dispatch = useDispatch();

	const refresh = () => {
		dispatch(getParts());
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			partName: item.partName || '',
			stockDate: moment(item.stockDate).format(moment.HTML5_FMT.DATE) || '',
			status: item.status || '',
		},
		onSubmit: (values) => {
			const formData = {
				partName: values.partName,
				stockDate: moment(values.stockDate).format(moment.HTML5_FMT.DATE),
				status: values.status,
			};

			if (isEdit) {
				dispatch(updateParts(id, formData, refresh));
			} else {
				dispatch(addParts(formData, refresh));
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
					<ModalTitle id={id}>{isEdit ? 'Update Part' : 'New Part'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup id='partName' label='Part Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.partName} />
						</FormGroup>
						{/* <FormGroup id='email' label='Email' className='col-md-6'>
							<Input
								type='email'
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
						</FormGroup> */}
						<FormGroup id='stockDate' label='Stock Date' className='col-md-6'>
							<Input
								type='date'
								onChange={formik.handleChange}
								value={formik.values.stockDate}
								enabled
							/>
						</FormGroup>
						<FormGroup label='Status' className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Default select example'
									placeholder='Choose...'
									list={_selectOptions}
									id='status'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.status}
								/>
							</InputGroup>
						</FormGroup>
						{/* <FormGroup id='type' label='Type' className='col-md-6'>
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
						</FormGroup> */}
						{/* <div className='col-md-6'>
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
ProductEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default ProductEditModal;
