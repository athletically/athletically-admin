import { start } from "@popperjs/core";

const API_ENDPOINT = 'http://15.206.27.50:3009/api/v1/admin/';

const getUsers = async (searchParams) => {
  let url = API_ENDPOINT+'getAllUsers?'
  if(searchParams.searchStr && searchParams.searchStr != '')
    url += `search=${searchParams.searchStr}&`
  if(searchParams.filter && searchParams.filter != '')
    url += `filter=${searchParams.filter}&`
  if(searchParams.sort && searchParams.sort != '')
    url += `sort=${searchParams.sort}&`

  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return [];
  return data.data;
}

const getSportsList = async () => {
  let url = API_ENDPOINT+'getGameList'
  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return [];
  return data.data;
}

const getPositionList = async (game_id) => {
  let url = API_ENDPOINT+'getPositionList?game_id='+game_id;
  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return [];
  return data.data;
}

const getUserDetails = async (id) => {
  let url = API_ENDPOINT+'getUserDetails?user_id='+id;
  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return {};
  return data.data;
}

const updateUserDetails = async (userdetails) => {
  let url = API_ENDPOINT+'updateUser';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user : userdetails})
  });
  const data = await response.json();
  if(data.err)
    return false;
  return true;
}

const getReels = async (searchParams) => {
  let url = API_ENDPOINT+'getAllReels?'
  if(searchParams.searchStr)
    url += `search=${searchParams.searchStr}&`
  if(searchParams.filter && searchParams.filter != '')
    url += `filter=${searchParams.filter}&`
  if(searchParams.sort && searchParams.sort != '')
    url += `sort=${searchParams.sort}&`

  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return [];
  return data.data;
}

const updateReel = async (reel_id, status) => {
  let url = API_ENDPOINT+'updateReel';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({reel_id : reel_id, status : status})
  });
  const data = await response.json();
  if(data.err)
    return false;
  return true;
}

const getGroups = async (searchParams) => {
  let url = API_ENDPOINT+'getAllGroups?'
  if(searchParams.searchStr && searchParams.searchStr != '')
    url += `search=${searchParams.searchStr}&`
  if(searchParams.filter && searchParams.filter != '')
    url += `filter=${searchParams.filter}&`
  if(searchParams.sort && searchParams.sort != '')
    url += `sort=${searchParams.sort}&`

  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return [];
  return data.data;
}

const updateGroup = async (group_id, status, group_name) => {
  let url = API_ENDPOINT+'modifyGroup';
  const dataToSend = {};
  if(!group_id)
    alert('Group ID is Required');
  dataToSend.group_id = group_id;
  if(status)
    dataToSend.status = status;
  if(group_name)
    dataToSend.name = group_name;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });
  const data = await response.json();
  if(data.err)
    return false;
  return true;
}

const getGroupDetails = async (id) => {
  let url = API_ENDPOINT+'getGroupDetails?group_id='+id;
  const response = await fetch(url);
  const data = await response.json();
  if(data.err)
    return {};
  return data.data;
}

const addNewGroup = async (group) => {
  let url = API_ENDPOINT+'addGroup';
  const dataToSend = group;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  });
  const data = await response.json();
  if(data.err)
    return false;
  return true;
}

const adminLogin = async (username, password) => {
  try {
    let url = API_ENDPOINT+'login';
    const dataToSend = {
      username : username,
      password : password
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });
    const data = await response.json();
    if(data.err)
      return {
        status : false,
        msg : data.message
      };
    else if(data.data.token){
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('name', data.data.name);
      return {
        status : true
      };
    }
    else
      return {
        status : false,
        msg : 'Something Went Wrong. Please Try Again'
      };
  } catch (error) {
    return {
      status : false,
      msg : 'Something Went Wrong. Please Try Again'
    };
  }
}




export { getUsers, getSportsList, getUserDetails, updateUserDetails, getReels, updateReel, getGroups, updateGroup, getGroupDetails, getPositionList, addNewGroup, adminLogin }
