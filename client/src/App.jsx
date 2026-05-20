import { Routes, Route, Navigate} from 'react-router-dom';
import SiteTemplate from "./components/SiteTemplate";
import LoginForm from "./components/LoginForm";
import Departments from './components/Departments';
import Employees from './components/Employees';
import Shifts from './components/Shifts';
import Users from './components/Users';
import NotFound from './components/NotFound';
import DepartmentForm from './components/DepartmentForm';
import  { useDepartments}  from './custom_hooks/useDepartments';

function App() {
 
    const { handleDepartmentAdd, handleDepartmentUpdate } = useDepartments();
    
  return (
     <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/" element={<SiteTemplate />}>
              <Route path="auth/login" element={<LoginForm />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/add" element={<DepartmentForm onSubmitHandler={handleDepartmentAdd} />} />              
              <Route path="departments/:departmentId" element ={<DepartmentForm  onSubmitHandler={handleDepartmentUpdate} />} /> 
              <Route path="employees" element={<Employees />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={<NotFound />} /> 
          </Route>
      </Routes>    
  )
}

export default App
