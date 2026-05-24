import { useForm, Controller } from "react-hook-form";
import {useEffect,useState } from "react";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl,FormHelperText} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import { Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { useEmployeeForm } from "../custom_hooks/useEmployeeForm";
import { formatDate } from "../utils/generalFuncs";


const EmployeeForm = ({onSubmitHandler}) =>
{
    const employeeForm = useForm({ defaultValues: { id:"",firstName: "", lastName:"",startYear:2000,departmentId:"",shifts:[],newShifts:[] }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = employeeForm;  
    const { departments,fetchAllDepartments,selectedEmployee,fetchEmployee} = useEmployeeForm();

    const [feedbackMsg, setFeedbackMsg] =useState("");
       
    const titleRegex = /^[\p{L}\d\s.,!?'"-]+$/u; 
    const forbiddenChars = /[<>{}\[\]]/; // Forbidden characters: < > { } [ ]
    const scriptPattern = /(script|onerror|onload|javascript:)/i; // Script-like patterns

    const { employeeId } = useParams();
    const navigate = useNavigate();


    useEffect( ()=>
    {
        if (employeeId)
        {
            fetchEmployee(employeeId);
        }
    },[employeeId]);


    useEffect(() => {
            if (selectedEmployee && departments.length > 0) {
                reset({
                    id: selectedEmployee.id,
                    firstName: selectedEmployee.firstName,
                    lastName: selectedEmployee.lastName,
                    startYear: selectedEmployee.startYear,
                    departmentId: selectedEmployee.department.id,
                    newShifts:[],
                });
            }
        }, [selectedEmployee,departments, reset]);

   

    useEffect( ()=>{
                fetchAllDepartments();
            }, []);

    const onSubmit = async (data) => 
    {
        const ok = await onSubmitHandler(data,setError);
        if (ok) 
        {
           setFeedbackMsg( employeeId ? "Employee updated successfully": "Employee added successfully");
            reset();
            setTimeout(() => {
                navigate("/employees");
            }, 1500);
        }
    };

    return (<Paper elevation={0} sx={{p: 0,width: "90%",maxWidth: 1200,boxSizing: "border-box",backgroundColor: "transparent",mx: "auto",mt: 2,mb: 2}} >
            {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}  
            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}   
            <form onSubmit={handleSubmit(onSubmit)} style={{backgroundColor:"transparent",border:"2px solid #C19A6B",borderRadius:"10PX", padding:"10px",width:"100%"}}>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    { employeeId ? 'Edit an Employee': 'Add a New Employee'}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ width: "100%" ,alignItems:{ xs: "flex-start", sm: "center" }}}>
                    <Typography sx={{ width: { sm:80} }}>Firstname: </Typography>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ 
                                required: "Firstame is missing or has invalid type." ,
                                minLength: { value: 2, message: "Firstname must be at least 2 characters" },
                                maxLength: { value: 80, message: "Firstname cannot exceed 80 characters" },    
                                pattern: { value: titleRegex, message: "Firstname contains invalid characters." },
                               }}
                        render={({ field }) => (
                                                <TextField
                                                {...field}
                                                size="small"                        
                                                error={!!errors.firstName}
                                                helperText={errors.firstName?.message}
                                                placeholder="Firstname"
                                                sx={{ width: "100%" }}                      
                                                />
                                )}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ marginTop:1,width: "100%" ,alignItems:{ xs: "flex-start", sm: "center" }}}>
                    <Typography sx={{ width: { sm:80} }}>Latname: </Typography>
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ 
                                required: "Lastame is missing or has invalid type." ,
                                minLength: { value: 2, message: "Lastname must be at least 2 characters" },
                                maxLength: { value: 80, message: "Lastname cannot exceed 80 characters" },    
                                pattern: { value: titleRegex, message: "Lastname contains invalid characters." },
                               }}
                        render={({ field }) => (
                                                <TextField
                                                {...field}
                                                size="small"                        
                                                error={!!errors.lastName}
                                                helperText={errors.lastName?.message}
                                                placeholder="Lastname"
                                                sx={{ width: "100%" }}                      
                                                />
                                )}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ marginTop:1, width: "100%" , alignItems:{ xs: "flex-start", sm: "center" } }}>
                    <Typography sx={{ width:80 }}>Start Year:</Typography>
                        <Controller
                                name="startYear"
                                control={control}
                                rules={{ required: "Start year is required", min: { value: 2000, message: "Start year must be > 2000" } }}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    error={!!errors.startYear}
                                    helperText={errors.startYear?.message}
                                    placeholder="Enter start year"
                                    sx={{ width: "50%" }}
                                    />
                                )}
                        />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ marginTop:1,width: "50%" , alignItems:{ xs: "flex-start", sm: "center" }}}>
                        <Typography sx={{ width:80 }}>Department:</Typography>
                        <Controller
                            name="departmentId"
                            control={control}
                            defaultValue="" 
                            rules={{
                                required: "Department is required",
                                pattern: {
                                        value: /^[0-9a-fA-F]{24}$/,
                                        message: "Invalid department ID format"
                                    }
                            }}
                            render={({ field }) => (
                                <FormControl sx={{ width: "100%" }} size="small" variant="outlined"   error={!!errors.departmentId} >
                                    <Select
                                        sx={{ width: { xs:"90%" , sm:"100%"} }}  
                                        {...field}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) return ""; // placeholder
                                            const selectedDepartment = departments.find(department => department.id === selected);
                                            return selectedDepartment ? selectedDepartment.name : selected; 
                                        }}
                                    >
                                        {departments.map((dept) => (
                                                <MenuItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.departmentId && (
                                        <FormHelperText>{errors.departmentId.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                </Stack>
                
                { selectedEmployee && <Stack spacing={1} sx={{ marginTop:1,width: "100%" }}>
                    <Typography>
                        Current Shifts:
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap                       
                        sx ={{ flexWrap:"wrap"}}
                    >
                        {selectedEmployee?.shifts?.map((shift) => (
                            <Chip
                                key={shift.id}
                                label={`${formatDate(shift.startDate)} ${formatDate(shift.endDate)}`}
                            />
                        ))}
                    </Stack>
                </Stack>}

                {selectedEmployee && (
                    <Stack spacing={1} sx={{ width: "100%" }}>
                        <Typography>Add Shifts:</Typography>                
                        <Controller
                            name="newShifts"
                            control={control}
                            defaultValue={[]}
                
                            render={({ field }) => {
                                // the shifts that will be displayed are filtered by the field vale
                                // selectedShifts is a list of objects so Autocomplete will be able to work with them 
                                const selectedShifts =
                                            selectedEmployee.unregisteredShifts.filter(
                                                                                            shift => field.value.includes(shift.id)
                                                                                        );
                
                                return (                                                                       
                                            <Autocomplete
                                                multiple                                                                                                    
                                                options={selectedEmployee.unregisteredShifts}
                                                value={selectedShifts}   
                                                
                                                 disablePortal

                                                slotProps={{
                                                    paper: {
                                                        sx: {
                                                            maxHeight: 220,
                                                        },
                                                    },
                                                    popper: {
                                                        placement: "bottom-start",
                                                    },
                                                    listbox: {
                                                        sx: {
                                                            maxHeight: 220,
                                                            overflowY: "auto",
                                                        },
                                                    },
                                                }}
                                               
                                                
                                                getOptionLabel={(option) =>
                                                    `${formatDate(option.startDate)} ${formatDate(option.endDate)}`
                                                }
                                                onChange={(_, newValue) => {
                                                    field.onChange(
                                                        newValue.map(shift => shift.id)
                                                    );
                                                }}                
                                                renderOption={(props, option, { selected }) => {
                                                    const { key, ...rest } = props;
                                                    return (
                                                        <li key={key} {...rest}>
                                                            <Checkbox checked={selected} sx={{ mr: 1 }} />
                                                               {`${formatDate(option.startDate)} ${formatDate(option.endDate)}`}
                                                        </li>
                                                    );
                                                }}                
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                    label="Select Shifts"
                                                    />
                                                )}
                                            />                                                                                        
                                        );
                            }}                                                                                
                        />                
                    </Stack>
                )}

                <Stack direction="row" spacing={1}  sx={{ alignItems:"flex-start"}}>
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                </Stack>

                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start", mt: 1 , textTransform:"capitalize"}}>
                    {selectedEmployee ? 'Update Employee':'Add Employee'}
                </Button>

            </form>        
    </Paper>)
}

export default EmployeeForm