
const employeeRepo = require('../repositories/employeeRepo');

const getAllEmployees = async (filters)=>{
    const temployees = await employeeRepo.getAllEmployees(filters);

    const employees = temployees.map(emp=>{         
        return {
                 id: emp._id,
                 firstName : emp.firstName,
                 lastName: emp.lastName,
                 startYear: emp.startYear,
                 department: {
                    id: emp.departmentId._id,
                    name: emp.departmentId.name
                 }
        };
    })

    return employees;

}
const getEmployeeById = async (id)=>{
    const temployee = await employeeRepo.getEmployeeById(id);
    let employee = null;
    
    if (temployee)
    {    
         employee = {
                        ... temployee._doc,
                        department:
                        {
                            id: temployee.departmentId._id,
                            name: temployee.departmentId.name
                        }
                    }
         delete employee.departmentId;            
    }
    
    return employee;
}

const addNewEmployee = (employeeObj)=>{
    return employeeRepo.addNewEmployee(employeeObj);
}

const employeeExists = (id) =>{
    return employeeRepo.employeeExists(id);
}

module.exports ={
    getAllEmployees,
    getEmployeeById,
    addNewEmployee,
    employeeExists    
}