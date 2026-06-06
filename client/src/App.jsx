import { Routes, Route, Navigate} from 'react-router-dom';
import SiteTemplate from "./components/SiteTemplate";
import LoginForm from "./components/LoginForm";
import Departments from './components/Departments';
import Employees from './components/Employees';
import Shifts from './components/Shifts';
import Users from './components/Users';
import NotFound from './components/NotFound';
import DepartmentForm from './components/DepartmentForm';
import EmployeeForm from './components/EmployeeForm';
import ShiftForm from './components/ShiftForm';
import  { useDepartments}  from './custom_hooks/useDepartments';
import  { useEmployees } from './custom_hooks/useEmployees';
import { useShifts} from './custom_hooks/useShifts';

function App() {
 
    const { handleDepartmentAdd, handleDepartmentUpdate } = useDepartments();
    const { handleEmployeeAdd, handleEmployeeUpdate} = useEmployees();
    const { handleShiftAdd, handleShiftUpdate} = useShifts();
    
  return (
     <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/" element={<SiteTemplate />}>
              <Route path="auth/login" element={<LoginForm />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/add" element={<DepartmentForm onSubmitHandler={handleDepartmentAdd} />} />              
              <Route path="departments/:departmentId" element ={<DepartmentForm  onSubmitHandler={handleDepartmentUpdate} />} /> 
              <Route path="employees" element={<Employees />} />
              <Route path="employees/add" element={<EmployeeForm onSubmitHandler={handleEmployeeAdd} />} />
              <Route path="employees/:employeeId" element={<EmployeeForm onSubmitHandler={handleEmployeeUpdate}  />} /> 
              <Route path="shifts" element={<Shifts />} />
              <Route path="shifts/add" element={<ShiftForm onSubmitHandler={handleShiftAdd} />} />
              <Route path="shifts/:shiftId" element={<ShiftForm onSubmitHandler={handleShiftUpdate} />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={<NotFound />} /> 
          </Route>
      </Routes>    
  )
}

export default App
