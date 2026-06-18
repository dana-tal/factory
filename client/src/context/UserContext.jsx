import { createContext, useState } from "react";

// Create the context
const UserContext = createContext({user: null,setUser: () => {} });  // the UserContext is the mechanism for sharing global data across components 

// Provider component that will wrap the app
const UserProvider = ({ children }) =>
{
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export
{
    UserContext,
    UserProvider
}