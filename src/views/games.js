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
import { getGames, addNewGame, updateGame, getGameDetails } from '../Api';
import { extractDate, getTypeFormatted } from '../Utils'

const Users = () => {
  const [games, setGames] = useState([]);
  const [searchTxt, setSearchTxt] = useState([]);
  const [filter, setFilter] = useState([]);
  const [visible, setVisible] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alert, setAlert] = useState('');
  const [isUpdating, setUpdating] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(false);

  useEffect(() => {
    fetchGames();
    fetchSports();
  }, []);

  const fetchGames = async (searchStr = '', filter = '') => {
    const searchParams = {};
    if(searchStr)
      searchParams.searchStr = searchStr;
    if(filter)
      searchParams.filter = filter;
    const fetchedGames = await getGames(searchParams);
    setGames(fetchedGames);
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
    fetchGames(searchStr, filter);
  }

  const handleFilter = (e) => {
    let filter = e.target.value;
    console.log(filter);
    setFilter(filter);
    fetchGames(searchTxt, filter);
  }

  const handleSort = (e) => {
    let sort = e.target.value;
    console.log(sort);
    setSort(sort)
    fetchGames(searchTxt, filter);
  }

  const getGameDtls = async(e) => {
    // setAlert(e.target.getAttribute('gr_id'));
    let game = await getGameDetails(e.target.getAttribute('game_id'));
    if (!game) {
      setAlert('Something Went Wrong');
    }
    await setSelectedGame(game)
    setVisible(true);
    setUpdating(true);
    setAlertVisible(false)
  }

  const handleGameNameChange = (e) => {
    const name = e.target.value;
    setSelectedGame((prevGame) => ({
      ...prevGame,
      name: name === '' ? '' : name,
    }));
  };

  const updateGameStatus = async(e) => {
    let game_id = e.target.id;
    let status = e.target.value;
    let gameName = '';

    const isUpdated = await updateGame(game_id, status, gameName);

    if(isUpdated){
      fetchGames(searchTxt, filter)
    }
    else{
      setAlert('Oops! Something Went Wrong');
    }

  }

  const updateGameName = async(e) => {
    let game_id = selectedGame._id;
    let status = selectedGame.status;
    let gameName = selectedGame.name;

    const isUpdated = await updateGame(game_id, status, gameName);

    if(isUpdated){
      fetchGames(searchTxt, filter)
      setVisible(false)
    }
    else{
      setAlert('Unable to Modify Game. Check Game Name');
      setAlertVisible(true);
    }

  }

  const openAddGameModal = async(e) => {
    setVisible(true);
    setUpdating(false);
    setInserting(true);
    setSelectedGame({name: '', status: 'active'});
    setAlertVisible(false)
  }

  const addGame = async(e) => {

    if(selectedGame.name === ''){
      setAlert("Game name can't be empty");
      setAlertVisible(true);
      return;
    }

    const isAdded = await addNewGame(selectedGame);

    if(!isAdded.err){
      fetchGames(searchTxt, filter)
      setVisible(false)
    }
    else{
      setAlert(isAdded.message);
      setAlertVisible(true);
    }
  }


  return (
    <div>
      <CCardHeader className='d-flex'>
        <div className='w-50'>
          <h3>All Games</h3>
        </div>
        <div className='d-flex justify-content-end w-50'>
          <CButton color='primary' onClick={openAddGameModal}>Add Game</CButton>
        </div>
      </CCardHeader>
      <CContainer fluid>
        <CRow className='my-3'>
          <CCol sm={10}>
            <CFormInput type="text" placeholder="Search by Game name" aria-label="" onChange={handleSearch}/>
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
        </CRow>
      </CContainer>
      <CTable bordered hover responsive='lg'>
        <CTableHead color='primary'>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Game Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody hover>
          {games.map((game, index) => (
            <CTableRow key={index} id={game._id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{game.name}</CTableDataCell>
              <CTableDataCell>
                <CFormSelect
                  aria-label=""
                  value={game.status}
                  onChange={updateGameStatus}
                  id={game._id}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CTableDataCell>
              <CTableDataCell>{extractDate(game.created_on)}</CTableDataCell>
              <CTableDataCell className='text-center'><CIcon icon={cilPencil} game_id={game._id} className="edit-icon" onClick={getGameDtls}/></CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {(isUpdating || isInserting) && (
        <CModal backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle><strong>{(isUpdating) ? `Modify Game` : `Add Game`}</strong></CModalTitle>
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
                        id="gameNameInput"
                        text=""
                        floatingLabel="Game Name"
                        placeholder="Input Game Name Here"
                        className='mb-3'
                        value={((isUpdating || isInserting) && selectedGame.name === '') ? '' : selectedGame.name}
                        onChange={handleGameNameChange}
                        autoFocus
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
            <CButton color="success" variant="outline" onClick={isUpdating ? updateGameName : addGame}>Save changes</CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default Users;
