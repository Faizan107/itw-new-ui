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
import PurchaseOrderReleasEditModal from './PurchaseOrderReleasEditModal';
import { getColorNameWithIndex } from '../../common/data/enumColors';
import useDarkMode from '../../hooks/useDarkMode';
import {
    getVendors,
} from '../../redux/actions/vendorActions';
import {
    addPurchaseOrderRelease,
    getPurchaseOrderRelease,
    updatePurchaseOrderRelease,
    deletePurchaseOrderRelease
} from '../../redux/actions/purchaseOrderReleaseActions';
import { getPurchaseOrder } from '../../redux/actions/purchaseOrderActions';
import { getParts } from '../../redux/actions/partsActions';

const PurchaseOrderReleaseList = () => {
	const { darkModeStatus } = useDarkMode();
    const dispatch = useDispatch();
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const [selectedUser, setSelectedUser] = useState(0);
	const [isEdit, setIsEdit] = useState(false);

    const { porInfo } = useSelector(
        (state) => state.purchaseOrderReleaseReducer
    );
    const { parts } = useSelector((state) => state.partsReducer);
    const { poInfo } = useSelector((state) => state.purchaseOrderReducer);

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
		dispatch(getPurchaseOrderRelease());
        dispatch(getPurchaseOrder());
        dispatch(getParts());
    }, []);

    useEffect(() => {
        if(porInfo && Object.keys(porInfo).length > 0){
            let data = [];
            Object.entries(porInfo).map((obj) => {
                data.push(obj[1]);
            });
            setFilteredData(data)
        }
    }, [porInfo]);

	const refresh = () => {
        dispatch(getPurchaseOrderRelease());
        dispatch(getPurchaseOrder());
        dispatch(getParts());
    };    
	const handleDelete = (id) => {
        dispatch(deletePurchaseOrderRelease(id, refresh));
    };

	const [editModalStatus, setEditModalStatus] = useState(false);
 
	return (
		<PageWrapper title={"Purchase Order Release"}>
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
						<h4>Purchase Order Release</h4>
					</SubHeaderLeft>
					<SubHeaderRight>
						<SubheaderSeparator />
						<Button
							icon='PersonAdd'
							color='primary'
							isLight
							onClick={() => {setEditModalStatus(true), setIsEdit(false), setSelectedUser(0)}}>
							New Purchase Order Release
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
												Purchase Order{' '}
											</th>
											<th>Part</th>
											<th>Release Date</th>
											<th className='cursor-pointer text-decoration-underline'>
												Status
											</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{ dataPagination(filteredData, currentPage, perPage).map((i) => (
											<tr key={i.id}>
												<td>
												{i._purchaseOrderInfoId}
												</td>
												<td>
												{parts.length}
												</td>
												<td>
													<div>{i.releaseDate}</div>
												</td>
												<td>{i.currentStatus}</td>
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
			<PurchaseOrderReleasEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={selectedUser} list={filteredData} isEdit={isEdit} />
		</PageWrapper>
	);
};

export default PurchaseOrderReleaseList;
