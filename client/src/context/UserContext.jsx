import { createContext, useState ,useCallback ,useEffect} from "react";
import { setLogout, setRemainingActionsFunc } from "../utils/authService";


// Create the context
const UserContext = createContext({user: null,setUser: () => {} ,logout: () => {}});  // the UserContext is the mechanism for sharing global data across components 

// Provider component that will wrap the app
const UserProvider = ({ children }) =>
{
  const [user, setUser] = useState(null);
  const [logoutReason, setLogoutReason] = useState(null);
  const [remainingActions, setRemainingActions] = useState(null);

  const logout = useCallback((reason = "standard") => {
    setLogoutReason(reason);
    setUser(null);
  }, []);


  const updateRemainingActions = useCallback( (remaining)=>{
      setRemainingActions(remaining);
  },[]);


  useEffect(() => {
    setLogout(logout);
  }, [logout]);

  useEffect( ()=>{
      setRemainingActionsFunc(updateRemainingActions);
  },[updateRemainingActions])
  
  return (
    <UserContext.Provider value={{ user, setUser,logout , logoutReason, remainingActions}}>
      {children}
    </UserContext.Provider>
  );
}

export
{
    UserContext,
    UserProvider
}