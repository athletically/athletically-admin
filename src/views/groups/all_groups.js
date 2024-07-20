import React, { useEffect, useState } from 'react';
import CIcon from '@coreui/icons-react'
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
  CFormFloating,
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
import {
  cilPencil
} from '@coreui/icons'
import { getGroups, getSportsList, getGroupDetails, updateGroup, getPositionList, addNewGroup } from '../../Api';
import { extractDate, getTypeFormatted } from '../../Utils'

const Users = () => {
  const [groups, setGroups] = useState([]);
  const [sports, setSports] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTxt, setSearchTxt] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [visible, setVisible] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alert, setAlert] = useState('');
  const [isUpdating, setUpdating] = useState(false);
  const [isInserting, setInserting] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchSports();
  }, []);

  const fetchGroups = async (searchStr = '', filter = '', sort = '') => {
    const searchParams = {};
    if(searchStr)
      searchParams.searchStr = searchStr;
    if(filter)
      searchParams.filter = filter;
    if(sort)
      searchParams.sort = sort;
    const fetchedGroups = await getGroups(searchParams);
    setGroups(fetchedGroups);
  };

  const fetchSports = async () => {
    const fetchedSports = await getSportsList();
    setSports(fetchedSports);
  }

  const fetchPositions = async (game_id) => {
    const fetchedRoles = await getPositionList(game_id);
    setRoles(fetchedRoles);
  }

  const handleSearch = (e) => {
    let searchStr = e.target.value;
    console.log(searchStr);
    setSearchTxt(searchStr)
    fetchGroups(searchStr, filter, sort);
  }

  const handleFilter = (e) => {
    let filter = e.target.value;
    console.log(filter);
    setFilter(filter);
    fetchGroups(searchTxt, filter, sort);
  }

  const handleSort = (e) => {
    let sort = e.target.value;
    console.log(sort);
    setSort(sort)
    fetchGroups(searchTxt, filter, sort);
  }

  const getGroupDtls = async(e) => {
    // setAlert(e.target.getAttribute('gr_id'));
    let group = await getGroupDetails(e.target.getAttribute('gr_id'));
    if (!group) {
      setAlert('Something Went Wrong');
    }
    await setSelectedGroup(group)
    await fetchPositions(group.game_id)
    setVisible(true);
    setUpdating(true);
    setAlertVisible(false)
  }

  const handleGroupNameChange = (e) => {
    const name = e.target.value;
    setSelectedGroup((prevGroup) => ({
      ...prevGroup,
      name: name === '' ? '' : name,
    }));
  };

  const updateGroupStatus = async(e) => {
    let group_id = e.target.id;
    let status = e.target.value;
    let groupName = '';

    const isUpdated = await updateGroup(group_id, status, groupName);

    if(isUpdated){
      fetchGroups(searchTxt, filter, sort)
    }
    else{
      setAlert('Oops! Something Went Wrong');
    }

  }

  const updateGroupName = async(e) => {
    let group_id = selectedGroup._id;
    let status = selectedGroup.status;
    let groupName = selectedGroup.name;

    const isUpdated = await updateGroup(group_id, status, groupName);

    if(isUpdated){
      fetchGroups(searchTxt, filter, sort)
      setVisible(false)
    }
    else{
      setAlert('Unable to Modify Group. Check Group Name');
      setAlertVisible(true);
    }

  }

  const handleGameChange = async(e) => {
    const game_id = e.target.value;
    setSelectedGroup((prevGroup) => ({
      ...prevGroup,
      game_id: game_id === '' ? '' : game_id,
    }));
    fetchPositions(game_id);
  }

  const handlePositionChange = async(e) => {
    const position_id = e.target.value;
    setSelectedGroup((prevGroup) => ({
      ...prevGroup,
      position_id: position_id === '' ? '' : position_id,
    }));
    fetchPositions(game_id);
  }

  const openAddGroupModal = async(e) => {
    setVisible(true);
    setUpdating(false);
    setInserting(true);
    setSelectedGroup({name: '', game_id: '', position_id: '', status: 'active'});
    setAlertVisible(false)
  }

  const addGroup = async(e) => {

    if(selectedGroup.name === ''){
      setAlert("Group name can't be empty");
      setAlertVisible(true);
      return;
    }

    if(selectedGroup.game_id === ''){
      setAlert("Please choose a sport");
      setAlertVisible(true);
      return;
    }

    if(selectedGroup.position_id === ''){
      setAlert("Please choose a role");
      setAlertVisible(true);
      return;
    }

    const isAdded = await addNewGroup(selectedGroup);

    if(isAdded){
      fetchGroups(searchTxt, filter, sort)
      setVisible(false)
    }
    else{
      setAlertVisible(true);
    }
  }


  return (
    <div>
      <CCardHeader className='d-flex'>
        <div className='w-50'>
          <h3>All Groups</h3>
        </div>
        <div className='d-flex justify-content-end w-50'>
          <CButton color='primary' onClick={openAddGroupModal}>Add Group</CButton>
        </div>
      </CCardHeader>
      <CContainer fluid>
        <CRow className='my-3'>
          <CCol sm={8}>
            <CFormInput type="text" placeholder="Search by Group / Sport / Position name" aria-label="" onChange={handleSearch}/>
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
              { label: 'Created Date - Old to New', value: 'date_o2n' },
              { label: 'Created Date - New to Old', value: 'date_n2o' }
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
            <CTableHeaderCell scope="col">Group Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sports</CTableHeaderCell>
            <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody hover>
          {groups.map((group, index) => (
            <CTableRow key={index} id={group._id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{group.name}</CTableDataCell>
              <CTableDataCell>{group.game}</CTableDataCell>
              <CTableDataCell>{group.position}</CTableDataCell>
              <CTableDataCell>
                <CFormSelect
                  aria-label=""
                  value={group.status}
                  onChange={updateGroupStatus}
                  id={group._id}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CTableDataCell>
              <CTableDataCell>{extractDate(group.created_on)}</CTableDataCell>
              <CTableDataCell className='text-center'><CIcon icon={cilPencil} gr_id={group._id} className="edit-icon" onClick={getGroupDtls}/></CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {selectedGroup && (isUpdating || isInserting) && (
        <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle><strong>{`Modify Group`}</strong></CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow>
                <CCol sm={12}>
                  <CAlert color="danger" variant="solid" dismissible visible={alertVisible} onClose={() => setAlertVisible(false)}>
                    {alert}
                  </CAlert>
                  <div className='mt-3 w-100'>
                      <CFormInput
                        type="text"
                        id="groupNameInput"
                        text=""
                        floatingLabel="Group Name"
                        placeholder="Input Group Name Here"
                        className='mb-3'
                        value={((isUpdating || isInserting) && selectedGroup.name === '') ? '' : selectedGroup.name}
                        onChange={handleGroupNameChange}
                        autoFocus
                      />
                  </div>
                  <div className='mt-3 w-100'>
                  <CFormSelect
                    aria-label=""
                    placeholder='Select Sport Here'
                    floatingLabel='Sport'
                    value={(isUpdating && selectedGroup.game_id === '') ? '' : selectedGroup.game_id}
                    options={[
                      {label : 'Select Sport Here', value: ''},
                      ...sports.map(sport => ({ label: sport.name, value: sport._id }))

                    ]}
                    onChange={handleGameChange}
                    disabled={isUpdating ? true : false}
                  />
                  </div>
                  <div className='mt-3 w-100'>
                    <CFormSelect
                      aria-label=""
                      placeholder='Select Role Here'
                      floatingLabel='Role'
                      value={(isUpdating && selectedGroup.position_id === '') ? '' : selectedGroup.position_id}
                      options={[
                        {label : 'Select Role Here', value: ''},
                        ...roles.map(role => ({ label: role.name, value: role._id }))

                      ]}
                      onChange={handlePositionChange}
                      disabled={isUpdating ? true : false}
                    />
                  </div>
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="outline" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="success" variant="outline" onClick={isUpdating ? updateGroupName : addGroup}>Save changes</CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default Users;
