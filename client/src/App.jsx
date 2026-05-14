import { Routes, Route, Navigate} from 'react-router-dom';
import SiteTemplate from "./components/SiteTemplate";
import LoginForm from "./components/LoginForm";
import Departments from './components/Departments';
import Employees from './components/Employees';
import Shifts from './components/Shifts';
import Users from './components/Users';

function App() {

  return (
     <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/" element={<SiteTemplate />}>
              <Route path="auth/login" element={<LoginForm />} />
              <Route path="departments" element={<Departments />} />
              <Route path="employees" element={<Employees />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="users" element={<Users />} /> 
          </Route>
      </Routes>    
  )
}

export default App
