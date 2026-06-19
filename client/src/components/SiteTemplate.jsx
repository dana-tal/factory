import { Outlet } from "react-router-dom";
import "./SiteTemplate.css";
import NavBar from "./NavBar";
import { requestLogout } from "../utils/authRequest";
import { useMatch, useNavigate } from "react-router-dom";
import { useContext ,useEffect } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useLocation } from "react-router-dom";


function SiteTemplate() {

  const match_auth = useMatch("/auth/*");
  const navigate = useNavigate();
  const { user, logoutReason ,logout} = useContext(UserContext);
  const location = useLocation();
  //const { user } = useContext(UserContext);
  //const { logout } = useContext(UserContext);

  const handleLogout = async () => {
  try {
    console.log("LOGOUT CLICKED");
    await requestLogout();
  } finally {
    logout("standard");
  }
};
   
  let links;

  links = [
      {link:'departments', name:'Departments'},
      {link:'employees', name:'Employees'},
      {link:'shifts', name:'Shifts'},
      {link:'users', name:'Users'},
     { name:'Logout', callback: handleLogout}
  ];

  useEffect(() => {
  if (!user && location.pathname !== "/auth/login") {
    navigate("/auth/login", {
      replace: true,
      state: { reason: logoutReason }
    });
  }
}, [user, logoutReason]);
          
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