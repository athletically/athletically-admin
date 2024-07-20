import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CFormInput,
  CFormSelect,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CImage,
  CFormLabel,
  CAlert
} from '@coreui/react';
import { getReels, updateReel } from '../../Api';
import { extractDate, getTypeFormatted } from '../../Utils'




const Reels = () => {

  const [reels, setReels] = useState([]);
  const [searchTxt, setSearchTxt] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async (searchStr = '', filter = '', sort = '') => {
    const searchParams = {};
    if(searchStr)
      searchParams.searchStr = searchStr;
    if(filter)
      searchParams.filter = filter;
    if(sort)
      searchParams.sort = sort;
    const fetchedUsers = await getReels(searchParams);
    setReels(fetchedUsers);
  };

  const handleSearch = (e) => {
    let searchStr = e.target.value;
    console.log(searchStr);
    setSearchTxt(searchStr)
    fetchReels(searchStr, filter, sort);
  }

  const handleFilter = (e) => {
    let filter = e.target.value;
    console.log(filter);
    setFilter(filter);
    fetchReels(searchTxt, filter, sort);
  }

  const handleSort = (e) => {
    let sort = e.target.value;
    console.log(sort);
    setSort(sort)
    fetchReels(searchTxt, filter, sort);
  }

  const updateReelStatus = async(e) => {
    let reel_id = e.target.id;
    let status = e.target.value;

    const isUpdated = await updateReel(reel_id, status);

    if(isUpdated){
      fetchReels(searchTxt, filter, sort)
    }
    else{
      alert('Oops! Something Went Wrong');
    }

  }

  return (
    <div>
      <CCardHeader>
        <h3>All Reels</h3>
      </CCardHeader>
      <CContainer fluid>
        <CRow className='my-3'>
          <CCol sm={8}>
            <CFormInput type="text" placeholder="Search by User's Name/Reel Caption" aria-label="" onChange={handleSearch}/>
          </CCol>
          {/* <CCol sm={1}>
            <CButton color="primary">Search</CButton>
          </CCol> */}
          <CCol sm={2}>
          <CFormSelect
            aria-label=""
            options={[
              {label : 'Filter by Status', value: ''},
              {label : 'Active', value: 'active'},
              {label : 'Inactive', value: 'inactive'},
            ]}
            onChange={handleFilter}
          />
          </CCol>
          <CCol sm={2}>
          <CFormSelect
            aria-label=""
            options={[
              'Sort by',
              { label: 'Likes - High to Low', value: 'likes_h2l' },
              { label: 'Likes - Low to High', value: 'likes_l2h' },
              { label: 'Views - High to Low', value: 'views_h2l' },
              { label: 'Views - Low to High', value: 'views_l2h' },
              { label: 'Posted On - Old to New', value: 'date_o2n' },
              { label: 'Posted On - New to Old', value: 'date_n2o' }
            ]}
            onChange={handleSort}
          />
          </CCol>
        </CRow>
      </CContainer>
      <CTable bordered responsive='lg'>
        <CTableHead color='primary'>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Posted By</CTableHeaderCell>
            <CTableHeaderCell scope="col">Caption</CTableHeaderCell>
            <CTableHeaderCell scope="col">Media</CTableHeaderCell>
            <CTableHeaderCell scope="col">Likes</CTableHeaderCell>
            <CTableHeaderCell scope="col">Views</CTableHeaderCell>
            <CTableHeaderCell scope="col">Posted On</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody hover>
          {reels.map((reel, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{reel.name}</CTableDataCell>
              <CTableDataCell>{reel.text}</CTableDataCell>
              <CTableDataCell align='center' className='mediaTd'>
                <video src={reel.reel_link} className='reel-in-tr'></video><br/>
                <a href={reel.reel_link} target='_blank' rel='noopener noreferrer'>View</a>
              </CTableDataCell>
              <CTableDataCell>{reel.likes}</CTableDataCell>
              <CTableDataCell>{reel.views}</CTableDataCell>
              <CTableDataCell>{extractDate(reel.created_on)}</CTableDataCell>
              <CTableDataCell>
                <CFormSelect
                  aria-label=""
                  value={reel.status}
                  onChange={updateReelStatus}
                  id={reel._id}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default Reels;
