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
import { demoPages, dashboardMenu } from '../../menu';
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
import VendorEditModal from './VendorsEditModal';
import { getColorNameWithIndex } from '../../common/data/enumColors';
import useDarkMode from '../../hooks/useDarkMode';
import {
    addVendors,
    getVendors,
    updateVendors
} from '../../redux/actions/vendorActions';

const VendorsList = () => {
	const { darkModeStatus } = useDarkMode();
    const { vendors } = useSelector((state) => state.vendorsReducer);

    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.userReducer);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);

	const [selectedUser, setSelectedUser] = useState(0);
	const [isEdit, setIsEdit] = useState(false);
	const [editModalStatus, setEditModalStatus] = useState(false);

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
            dispatch(getVendors());
    }, []);

    useEffect(() => {
        if(vendors && Object.keys(vendors).length > 0){
            let data = [];
            Object.entries(vendors).map((obj) => {
                data.push(obj[1]);
            });
            setFilteredData(data)
        }
    }, [vendors]);


	return (
		<PageWrapper title={"Vendors"}>
			{/* <SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search customer...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button
								icon='FilterAlt'
								color='dark'
								isLight
								className='btn-only-icon position-relative'>
								{data.length !== filteredData.length && (
									<Popovers desc='Filtering applied' trigger='hover'>
										<span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2'>
											<span className='visually-hidden'>
												there is filtering
											</span>
										</span>
									</Popovers>
								)}
							</Button>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg'>
							<div className='container py-2'>
								<div className='row g-3'>
									<FormGroup label='Balance' className='col-12'>
										<InputGroup>
											<Input
												id='minPrice'
												ariaLabel='Minimum price'
												placeholder='Min.'
												onChange={formik.handleChange}
												value={formik.values.minPrice}
											/>
											<InputGroupText>to</InputGroupText>
											<Input
												id='maxPrice'
												ariaLabel='Maximum price'
												placeholder='Max.'
												onChange={formik.handleChange}
												value={formik.values.maxPrice}
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup label='Payments' className='col-12'>
										<ChecksGroup>
											{Object.keys(PAYMENTS).map((payment) => (
												<Checks
													key={PAYMENTS[payment].name}
													id={PAYMENTS[payment].name}
													label={PAYMENTS[payment].name}
													name='payment'
													value={PAYMENTS[payment].name}
													onChange={formik.handleChange}
													checked={formik.values.payment.includes(
														PAYMENTS[payment].name,
													)}
												/>
											))}
										</ChecksGroup>
									</FormGroup>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						New Customer
					</Button>
				</SubHeaderRight>
			</SubHeader> */}
				<SubHeader>
					<SubHeaderLeft>
						<h4>Vendors</h4>
					</SubHeaderLeft>
					<SubHeaderRight>
						<SubheaderSeparator />
						<Button
							icon='PersonAdd'
							color='primary'
							isLight
							onClick={() => {setEditModalStatus(true), setIsEdit(false), setSelectedUser(0)}}>

							New Vendor
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
											<th>Address</th>
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
													<div>{i.street +
                                                ',' +
                                                i.city +
                                                ',' +
                                                i.state +
                                                ',(' +
                                                i.postal_code +
                                                ')'}</div>
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
															{/* <DropdownItem>
																<Button
																	icon='Visibility'
																	tag='a'
																	to={`../${demoPages.crm.subMenu.customerID.path}/${i.id}`}>
																	View
																</Button>
															</DropdownItem> */}
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
																	icon='Pencil'
																	tag='a'
																	to={`../${dashboardMenu.vendorsPurchaseOrdersList.path}/${i._id}`}>	
																	Purchase Order
																</Button>
															</DropdownItem>
															<DropdownItem>
                                                            	<Button
																	icon='Pencil'
																	tag='a'
																	to={`../${dashboardMenu.vendorsReleaseOrdersList.path}/${i._id}`}>	
																	Release Order
																</Button>
															</DropdownItem>
															<DropdownItem>
                                                            	<Button
																	icon='Pencil'
																	tag='a'>
																	Add Part
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
								label='vendors'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<VendorEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus}  id={selectedUser} list={filteredData} isEdit={isEdit} />
		</PageWrapper>
	);
};

export default VendorsList;
