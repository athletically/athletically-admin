const r="http://15.206.27.50:3009/api/v1/admin/",l=async t=>{let e=r+"getAllUsers?";t.searchStr&&t.searchStr!=""&&(e+=`search=${t.searchStr}&`),t.filter&&t.filter!=""&&(e+=`filter=${t.filter}&`),t.sort&&t.sort!=""&&(e+=`sort=${t.sort}&`);const s=await(await fetch(e)).json();return s.err?[]:s.data},d=async()=>{let t=r+"getGameList";const n=await(await fetch(t)).json();return n.err?[]:n.data},u=async t=>{let e=r+"getPositionList?game_id="+t;const s=await(await fetch(e)).json();return s.err?[]:s.data},f=async t=>{let e=r+"getUserDetails?user_id="+t;const s=await(await fetch(e)).json();return s.err?{}:s.data},c=async t=>{let e=r+"updateUser";return!(await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:t})})).json()).err},p=async t=>{let e=r+"getAllReels?";t.searchStr&&(e+=`search=${t.searchStr}&`),t.filter&&t.filter!=""&&(e+=`filter=${t.filter}&`),t.sort&&t.sort!=""&&(e+=`sort=${t.sort}&`);const s=await(await fetch(e)).json();return s.err?[]:s.data},g=async(t,e)=>{let n=r+"updateReel";return!(await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reel_id:t,status:e})})).json()).err},y=async t=>{let e=r+"getAllGroups?";t.searchStr&&t.searchStr!=""&&(e+=`search=${t.searchStr}&`),t.filter&&t.filter!=""&&(e+=`filter=${t.filter}&`),t.sort&&t.sort!=""&&(e+=`sort=${t.sort}&`);const s=await(await fetch(e)).json();return s.err?[]:s.data},S=async(t,e,n)=>{let s=r+"modifyGroup";const o={};return t||alert("Group ID is Required"),o.group_id=t,e&&(o.status=e),n&&(o.name=n),!(await(await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()).err},w=async t=>{let e=r+"getGroupDetails?group_id="+t;const s=await(await fetch(e)).json();return s.err?{}:s.data},j=async t=>{let e=r+"addGroup";return!(await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json()).err},T=async(t,e)=>{try{let n=r+"login";const a=await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,password:e})})).json();return a.err?{status:!1,msg:a.message}:a.data.token?(localStorage.setItem("token",a.data.token),localStorage.setItem("name",a.data.name),{status:!0}):{status:!1,msg:"Something Went Wrong. Please Try Again"}}catch{return{status:!1,msg:"Something Went Wrong. Please Try Again"}}};export{T as a,d as b,f as c,p as d,g as e,y as f,l as g,w as h,S as i,j,u as k,c as u};
