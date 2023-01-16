import React, { useState } from 'react';
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
import Select from '../../components/bootstrap/forms/Select';
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
import {
    addUser,
    getUsers,
    updateUser,
} from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import idea from 'react-syntax-highlighter/dist/cjs/styles/hljs/idea';
import { useEffect } from 'react';

export const _selectOptions = [
	{ value: 'Super Admin', text: 'Super Admin' },
	{ value: 'Vendor Admin', text: 'Vendor Admin' },
	{ value: 'Purchase Order Admin', text: 'Purchase Order Admin' },
	{ value: 'Parts Admin', text: 'Parts Admin' },
	{ value: 'User Admin', text: 'User Admin' },
];
const UserEditModal = ({ id, isOpen, setIsOpen, list, isEdit }, props) => {
	const itemData = id ? list.filter((item) => item._id === id) : {};
	const item = id ? itemData[0] : {};
	const [status, setStatus] = useState(false);
	const dispatch = useDispatch();

	const refresh = () => {
		dispatch(getUsers());
	};
	useEffect(()=>{
		if (isEdit) {
		setStatus(item.active);
		}
	}, [isEdit, item]);
	const formik = useFormik({
		// enableReinitialize={true}
		enableReinitialize: true,
		initialValues: {
			firstName: item.firstName || '',
			lastName: item.lastName || '',
			email: item.email || '',
			password: item.password || '',
			role: item.role || '',
			status: item.active || false,
		},
		
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => {
			let formData = {
				firstName: values.firstName,
				lastName:values.lastName,
				email:values.email,
				password:values.password,
				role: values.role,
				active: status
			};
			if (isEdit) {
				dispatch(updateUser(id, formData, refresh));
			} else {
				dispatch(addUser(formData, refresh));
			}

			// if (isEditForm) {
			// 	dispatch(updateUser(edit?._id, formData, refresh));
			// } else {
			// 	dispatch(addUser(formData, refresh));
			// }
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
					<ModalTitle id={id}>{isEdit ? 'Update User' : 'Add new user'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup id='firstName' label='First Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.firstName} />
						</FormGroup>
						<FormGroup id='lastName' label='Last Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.lastName} />
						</FormGroup>
						<FormGroup id='email' label='Email' className='col-md-6'>
							<Input
								type='email'
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
						</FormGroup>
						<FormGroup id='password' label='Password' className='col-md-6'>
							<Input
								type='password'
								onChange={formik.handleChange}
								value={formik.values.password}
							/>
						</FormGroup>
						<FormGroup name="role" label='Role' className='col-md-6'>
							<InputGroup>
								<Select
									ariaLabel='Default select example'
									placeholder='Choose...'
									id="role"
									list={_selectOptions}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.role}
								/>
							</InputGroup>
						</FormGroup>
						<FormGroup id="status" label={ status ? 'Active' : 'Inactive'} className='col-md-6'>
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
UserEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default UserEditModal;
