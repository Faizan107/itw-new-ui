import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import { demoPages } from '../../menu';
import Card, { CardBody } from '../../components/bootstrap/Card';
import { getFirstLetter, priceFormat } from '../../helpers/helpers';
import data from '../../common/data/dummyCustomerData';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../components/PaginationButtons';
import Button from '../../components/bootstrap/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/bootstrap/forms/Input';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../common/data/enumPaymentMethod';
import useSortableData from '../../hooks/useSortableData';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';
import Popovers from '../../components/bootstrap/Popovers';
import UserEditModal from './UserEditModal';
import { getColorNameWithIndex } from '../../common/data/enumColors';
import useDarkMode from '../../hooks/useDarkMode';
import {
    addUser,
    getUsers,
    updateUser,
    deleteUser
} from '../../redux/actions/userActions';

const UsersList = () => {
	const { darkModeStatus } = useDarkMode();
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.userReducer);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [selectedUser, setSelectedUser] = useState(0);
	const [isEdit, setIsEdit] = useState(false);

	const formik = useFormik({
		initialValues: {
			searchInput: '',
			minPrice: '',
			maxPrice: '',
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
		},
	});

    useEffect(() => {
            dispatch(getUsers());
    }, []);

    useEffect(() => {
        if(users && Object.keys(users).length > 0){
            let data = [];
            Object.entries(users).map((obj) => {
                data.push(obj[1]);
            });
            setFilteredData(data)
        }
    }, [users]);

	const refresh = () => {
        // setOpen(false);
        // setFirstName('');
        // setLastName('');
        // setEmail('');
        // setRole('');
        // setStatus(false);
        dispatch(getUsers());
    };
    const handleDelete = (id) => {
        dispatch(deleteUser(id, refresh));
    };

	return (
		<PageWrapper title={"Users"}>
			<SubHeader>
				<SubHeaderLeft>
					<h4>Users</h4>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => {setEditModalStatus(true), setIsEdit(false), setSelectedUser(0)}}>
						Add new user
					</Button>
				</SubHeaderRight>
			</SubHeader> 
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												className='cursor-pointer text-decoration-underline'>
												Name{' '}
												<Icon
													size='lg'
													icon='FilterList'
												/>
											</th>
											<th>Email</th>
											<th>Role</th>
											<th
												className='cursor-pointer text-decoration-underline'>
												Status
												<Icon
													size='lg'
													icon='FilterList'
												/>
											</th>
											
											<td />
										</tr>
									</thead>
									<tbody>
										{ dataPagination(filteredData, currentPage, perPage).map((i) => (
											<tr key={i.id}>
												<td>
													<div className='d-flex align-items-center'>
														<div className='flex-grow-1'>
															<div className='fs-6 fw-bold'>
																{i.firstName} {i.lastName}
															</div>
														</div>
													</div>
												</td>
												<td>
													<Button
														isLink
														color='light'
														icon='Email'
														className='text-lowercase'
														tag='a'
														href={`mailto:${i.email}`}>
														{i.email}
													</Button>
												</td>
												<td>
													<div>{i.role}</div>
												</td>
												<td>{i.active == true ? 'Active' : 'Inactive'}</td>
												<td>
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button
																icon='MoreHoriz'
																color='dark'
																isLight
																shadow='sm'
															/>
														</DropdownToggle>
														<DropdownMenu isAlignmentEnd>
															<DropdownItem>
                                                            	<Button
																	icon='Pencil'
																	tag='a'
																	onClick={() => {setEditModalStatus(true), setSelectedUser(i._id), setIsEdit(true)}}>
																	Edit
																</Button>
																
															</DropdownItem>
                                                            <DropdownItem>
																<Button
																	icon='Delete'
																	tag='b' 
																	onClick={() => {
																		handleDelete(
																			i._id
																		);
																	}}>
																	Delete
																</Button>
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={filteredData}
								label='users'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<UserEditModal setIsOpen={setEditModalStatus}  isOpen={editModalStatus} id={selectedUser} list={filteredData} isEdit={isEdit}   />
		</PageWrapper>
	);
};

export default UsersList;
