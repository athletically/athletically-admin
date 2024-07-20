import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { adminLogin } from '../../../Api';

const Login = () => {

  const [alert, setAlert] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const hanleLogin = async(e) => {
    e.preventDefault();
    if(username === ''){
      setAlert("Username Can't be empty");
      return false;
    }
    if(password === ''){
      setAlert("Password Can't be empty");
      return false;
    }
    const loggedIn = await adminLogin(username, password);
    if(loggedIn.status){
      navigate('/users/all')
    }
    else{
      setAlert(loggedIn.msg);
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to Athletically Admin Panel</p>
                    <CAlert color="warning" visible={alert !== '' ? true : false}>
                      {alert}
                    </CAlert>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      type='email'
                      onChange={(e) => {setUsername(e.target.value)}}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => {setPassword(e.target.value)}}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        {/* <CButton color="link" className="px-0"> */}
                          {/* Forgot password? */}
                        {/* </CButton> */}
                      </CCol>
                      <CCol xs={6} className='text-end'>
                        <CButton color="primary" className="px-4" type='submit' onClick={hanleLogin}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
