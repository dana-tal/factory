import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { requestLogout } from "../utils/authRequest";
import { useMatch, useNavigate } from "react-router-dom";

function SiteTemplate() {

  const match_auth = useMatch("/auth/*");
  const navigate = useNavigate();

  const handleLogout = ()=>{
        requestLogout();
        navigate("/auth/login", { replace: true });
  }

   
  let links;

  links = [
      {link:'departments', name:'Departments'},
      {link:'employees', name:'Employees'},
      {link:'shifts', name:'Shifts'},
      {link:'users', name:'Users'},
     { name:'Logout', callback: handleLogout}
  ];

          
  return (  
    <div  className={ match_auth ? "site-container site-container2":"site-container"} >  
       { /* !match_auth && <span> <h3 style={{ marginLeft:"30px" ,color:"#654321"}}>Hello, {info.userData.userName}</h3> <NavBar links={links} /></span> */}  
        
        { !match_auth && <NavBar links={links} /> }
       <div className="outlet-style" >
       
          <Outlet />      
        </div>
    </div>
  )
}

export default SiteTemplate