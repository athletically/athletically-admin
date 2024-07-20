import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
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
import { getUsers, getSportsList, getUserDetails, updateUserDetails } from '../../Api';
import { extractDate, getTypeFormatted } from '../../Utils'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchTxt, setSearchTxt] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [visible, setVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSports();
    checkLoggedIn();
  }, []);

  const checkLoggedIn = () => {
    let token = localStorage.getItem('token');
    if(token && token !== '') {}
    else{
      navigator = useNavigate();
      navigator({to: '/login'});
    }
  }

  const fetchUsers = async (searchStr = '', filter = '', sort = '') => {
    const searchParams = {};
    if(searchStr)
      searchParams.searchStr = searchStr;
    if(filter)
      searchParams.filter = filter;
    if(sort)
      searchParams.sort = sort;
    const fetchedUsers = await getUsers(searchParams);
    setUsers(fetchedUsers);
  };

  const fetchSports = async () => {
    const fetchedSports = await getSportsList();
    setSports(fetchedSports);
  }

  const handleSearch = (e) => {
    let searchStr = e.target.value;
    console.log(searchStr);
    setSearchTxt(searchStr)
    fetchUsers(searchStr, filter, sort);
  }

  const handleFilter = (e) => {
    let filter = e.target.value;
    console.log(filter);
    setFilter(filter);
    fetchUsers(searchTxt, filter, sort);
  }

  const handleSort = (e) => {
    let sort = e.target.value;
    console.log(sort);
    setSort(sort)
    fetchUsers(searchTxt, filter, sort);
  }

  const getUserDtls = async(e) => {
    let user = await getUserDetails(e.currentTarget.id);
    if (!user) {
      alert('Something Went Wrong');
    }
    setVisible(true);
    setAlertVisible(false)
    setSelectedUser(user)
  }

  const handleScoreChange = (e) => {
    const score = e.target.value;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      score: score === '' ? '' : parseInt(score, 10),
    }));
  };

  const updateUserScore = async() => {
    if(selectedUser.score === ''){
      setAlertVisible(true)
      return false;
    }
    const updatedUser = await updateUserDetails(selectedUser)
    if(updatedUser){
      setAlertVisible(false)
      setVisible(false)
      fetchUsers(searchTxt, filter, sort);
    }
    else
      setAlertVisible(true)

  }


  return (
    <div>
      <CCardHeader>
        <h3>All Users</h3>
      </CCardHeader>
      <CContainer fluid>
        <CRow className='my-3'>
          <CCol sm={8}>
            <CFormInput type="text" placeholder="Search by User's Name" aria-label="" onChange={handleSearch}/>
          </CCol>
          {/* <CCol sm={1}>
            <CButton color="primary">Search</CButton>
          </CCol> */}
          <CCol sm={2}>
          <CFormSelect
            aria-label=""
            options={[
              {label : 'Filter by Sports', value: ''},
              ...sports.map(sport => ({ label: sport.name, value: sport._id }))

            ]}
            onChange={handleFilter}
          />
          </CCol>
          <CCol sm={2}>
          <CFormSelect
            aria-label=""
            options={[
              'Sort by',
              { label: 'Score - High to Low', value: 'score_h2l' },
              { label: 'Score - Low to High', value: 'score_l2h' },
              { label: 'Signup Date - Old to New', value: 'date_o2n' },
              { label: 'Signup Date - New to Old', value: 'date_n2o' }
            ]}
            onChange={handleSort}
          />
          </CCol>
        </CRow>
      </CContainer>
      <CTable bordered hover responsive='lg'>
        <CTableHead color='primary'>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sports</CTableHeaderCell>
            <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            <CTableHeaderCell scope="col">Score</CTableHeaderCell>
            <CTableHeaderCell scope="col">Signup Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody hover>
          {users.map((user, index) => (
            <CTableRow key={index} id={user._id} onClick={getUserDtls}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{getTypeFormatted(user.user_type)}</CTableDataCell>
              <CTableDataCell>{user.sports}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
              <CTableDataCell>{user.score}</CTableDataCell>
              <CTableDataCell>{extractDate(user.created_on)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {selectedUser && (
        <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>User Score : <strong>{selectedUser.name}</strong></CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  {/* <CImage src={selectedUser.image} fluid rounded></CImage> */}
                  <div className='mt-3'>
                    <CFormInput
                      type="number"
                      id="userScoreInput"
                      label="Score"
                      text="Must be a number."
                      value={selectedUser.score === '' ? '' : selectedUser.score}
                      onChange={handleScoreChange}
                      autoFocus
                    />
                    <CAlert color="danger" variant="solid" dismissible visible={alertVisible} onClose={() => setAlertVisible(false)}>
                      Something Went Wrong. Please Try Again
                    </CAlert>
                  </div>
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="outline" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="success" variant="outline" onClick={updateUserScore}>Save changes</CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default Users;
