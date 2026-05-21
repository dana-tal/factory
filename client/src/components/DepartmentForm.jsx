
import { useForm, Controller } from "react-hook-form";
import {useState,useEffect } from "react";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl,FormHelperText} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import { Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { useDepartmentForm } from "../custom_hooks/useDepartmentForm";

const DepartmentForm = ({ onSubmitHandler })=>{

    const departmentForm = useForm({ defaultValues: { id:"",name: "", managerId:"",employees:[],externalEmployees:[] }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = departmentForm;  
    
    const { managers, fetchAllEmployees,selectedDepartment, fetchDepartment } = useDepartmentForm();

    const [feedbackMsg, setFeedbackMsg] =useState("");
   
    const titleRegex = /^[\p{L}\d\s.,!?'"-]+$/u; 
    const forbiddenChars = /[<>{}\[\]]/; // Forbidden characters: < > { } [ ]
    const scriptPattern = /(script|onerror|onload|javascript:)/i; // Script-like patterns

    const { departmentId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (selectedDepartment) {
            reset({
                id: selectedDepartment.id,
                name: selectedDepartment.name,
                managerId: selectedDepartment.manager.id,
                newEmployees:[],
            });
        }
    }, [selectedDepartment, reset]);

    useEffect( ()=>{
          if (departmentId)
          {
            fetchDepartment(departmentId);
          }
    },[departmentId]);


    const onSubmit = async (data) => 
    {
        const ok = await onSubmitHandler(data,setError);
        if (ok) 
        {
           setFeedbackMsg( departmentId ? "Department updated successfully": "Department added successfully");
            reset();
            setTimeout(() => {
                navigate("/departments");
            }, 1500);
        }
    };

    
        useEffect( ()=>{
            fetchAllEmployees();
        }, []);


    return    <Paper
            elevation={0}
             sx={{
                    p: 0,
                    width: "90%",
                    maxWidth: 1200,
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    mx: "auto",
                    mt: 2,
                    mb: 2
                }} 
           
            >
                    {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}  
                     {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                      <form onSubmit={handleSubmit(onSubmit)} style={{backgroundColor:"transparent",border:"2px solid #C19A6B",borderRadius:"10PX", padding:"10px",width:"100%"}}>
                                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                                   { departmentId ? 'Edit a Department': 'Add a New Department'}
                                </Typography>
                                  <Stack spacing={2}>

                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ width: "100%" ,alignItems:{ xs: "flex-start", sm: "center" }}}>
                                                            <Typography sx={{ width: { sm:80} }}>Name:</Typography>
                                                            <Controller
                                                            name="name"
                                                            control={control}
                                                              rules={{ 
                                                                required: "Department name is missing or has invalid type." ,
                                                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                                                maxLength: { value: 80, message: "Name cannot exceed 80 characters" },    
                                                                pattern: { value: titleRegex, message: "Name contains invalid characters." },
                                                             }}
                                                            render={({ field }) => (
                                                                <TextField
                                                                {...field}
                                                                size="small"                        
                                                                error={!!errors.name}
                                                                helperText={errors.name?.message}
                                                                placeholder="Department Name"
                                                                 sx={{ width: "100%" }}                      
                                                                />
                                                            )}
                                                            />
                                        </Stack>

                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ width: "100%" , alignItems:{ xs: "flex-start", sm: "center" }}}>
                                                            <Typography sx={{ width:80 }}>Manager:</Typography>
                                                            <Controller
                                                                name="managerId"
                                                                control={control}
                                                                 defaultValue="" 
                                                                 rules={{
                                                                    required: "Manager is required",
                                                                    pattern: {
                                                                    value: /^[0-9a-fA-F]{24}$/,
                                                                    message: "Invalid manager ID format"
                                                                    }
                                                                }}
                                                                render={({ field }) => (
                                                                    <FormControl sx={{ width: "100%" }} size="small" variant="outlined"   error={!!errors.managerId} >
                                                                    <Select
                                                                        sx={{ width: { xs:"90%" , sm:"100%"} }}  
                                                                        {...field}
                                                                        displayEmpty
                                                                        renderValue={(selected) => {
                                                                        if (!selected) return ""; // placeholder
                                                                        const selectedManager = managers.find(manager => manager.id === selected);
                                                                        return selectedManager ? selectedManager.firstName+' '+selectedManager.lastName : selected; 
                                                                        }}
                                                                    >
                                                                        {managers.map((manager) => (
                                                                        <MenuItem key={manager.id} value={manager.id}>
                                                                            {manager.firstName+' '+manager.lastName}
                                                                        </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                     {errors.managerId && (
                                                                            <FormHelperText>{errors.managerId.message}</FormHelperText>
                                                                        )}
                                                                    </FormControl>
                                                                )}
                                                                />
                                                        </Stack>

                                                        { selectedDepartment && <Stack spacing={1} sx={{ width: "100%" }}>
                                                            <Typography>
                                                                Current Employees:
                                                            </Typography>
                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                useFlexGap
                                                                flexWrap="wrap"
                                                            >
                                                                {selectedDepartment?.employees?.map((employee) => (
                                                                    <Chip
                                                                        key={employee.id}
                                                                        label={`${employee.firstName} ${employee.lastName}`}
                                                                    />
                                                                ))}
                                                            </Stack>
                                                        </Stack>}

                                                        {selectedDepartment && (

                                                        <Stack spacing={1} sx={{ width: "100%" }}>

                                                            <Typography>
                                                                Add Employees:
                                                            </Typography>

                                                            <Controller
                                                                name="newEmployees"
                                                                control={control}
                                                                defaultValue={[]}

                                                                render={({ field }) => {

                                                                    // the employees that will be displayed are filtered by the field vale
                                                                    // selectedEmployees is a list of objects so Autocomplete will be able to work with them 
                                                                    const selectedEmployees =
                                                                        selectedDepartment.externalEmployees.filter(
                                                                            employee => field.value.includes(employee.id)
                                                                        );

                                                                    return (                                                                       
                                                                        <Autocomplete
                                                                                    multiple
                                                                                    
                                                                                    options={selectedDepartment.externalEmployees}
                                                                                    value={selectedEmployees}

                                                                                    getOptionLabel={(option) =>
                                                                                        `${option.firstName} ${option.lastName}`
                                                                                    }

                                                                                    onChange={(_, newValue) => {
                                                                                        field.onChange(
                                                                                            newValue.map(emp => emp.id)
                                                                                        );
                                                                                    }}

                                                                                    renderOption={(props, option, { selected }) => {
                                                                                        const { key, ...rest } = props;

                                                                                        return (
                                                                                            <li key={key} {...rest}>
                                                                                                <Checkbox checked={selected} sx={{ mr: 1 }} />
                                                                                                {option.firstName} {option.lastName}
                                                                                            </li>
                                                                                        );
                                                                                    }}

                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Select Employees"
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
                                                           {selectedDepartment ? 'Update Department':'Add Department'}
                                          </Button>
                                         
                                  </Stack>
                            </form>
                    
            </Paper>
           
}

export default DepartmentForm