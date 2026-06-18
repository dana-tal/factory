import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { requestLogout } from "../utils/authRequest";
import { useMatch, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

function SiteTemplate() {

  const match_auth = useMatch("/auth/*");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

      {!match_auth && (
        <>
          <div style={{ marginLeft: "30px", marginTop:"5px", fontFamily:"Arial", fontWeight:"bold",color: "#654321" }}>
            Hello, {user?.name}
          </div>

          <NavBar links={links} />
        </>
      )}

        { /*!match_auth && <NavBar links={links} /> */}
       <div className="outlet-style" >
       
          <Outlet />      
        </div>
    </div>
  )
}

export default SiteTemplate