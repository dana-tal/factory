
import { requestDepartmentById, requestAllManagers } from "../utils/departmentRequest";
import { useForm, Controller } from "react-hook-form";
import {useState,useEffect } from "react";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl,FormHelperText} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DepartmentForm = ({ onAddDepartment , onUpdateDepartment, departmentId="" })=>{

    const departmentForm = useForm({ defaultValues: { id:"",name: "", managerId:"" }, });
    const { handleSubmit,control,formState: { errors },reset, setError}  = departmentForm;  
    
    const [managers, setManagers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const titleRegex = /^[\p{L}\d\s.,!?'"-]+$/u; 
    const forbiddenChars = /[<>{}\[\]]/; // Forbidden characters: < > { } [ ]
    const scriptPattern = /(script|onerror|onload|javascript:)/i; // Script-like patterns
   
    const navigate = useNavigate();
    
    useEffect(() => {
        if (selectedDepartment) {
            reset({
                id: selectedDepartment.id,
                name: selectedDepartment.name,
                managerId: selectedDepartment.manager.id,
            });
        }
    }, [selectedDepartment, reset]);

    useEffect( ()=>{
          const fetchDepartment = async (id)=>{
            try
            {
                const response = await requestDepartmentById(id);
                if (response.ok)
                {
                     setSelectedDepartment(response.departmentData);
                }
            }
            catch(err)
            {
                console.log(err);
            }
          } 
          
          if (departmentId)
          {
            fetchDepartment(departmentId);
          }
          else
          {
             setSelectedDepartment(null);
          }
    
    },[departmentId]);


    const onSubmit = async (data) => 
    {
        let ok;

         if (departmentId)
         {
               ok = await onUpdateDepartment(data, setError);
         }
         else
         {
                ok = await onAddDepartment(data, setError);                
         }
        if (ok) 
        {
            reset();
            navigate("/departments");
        }
    };

    
        useEffect( ()=>{
                
            const fetchAllManagers = async ()=>{
    
                try
                {
                    const allManagers = await requestAllManagers();
                   // console.log("all Managers");
                   // console.log(allManagers);
                    setManagers(allManagers);
                }
                catch(err)
                {
                    console.log(err);
                }
            }
    
            fetchAllManagers();
    
        }, []);


    return   <>
           <Paper
            elevation={0}
             sx={{
                  /*  p: 0,
                    mx: "auto",
                    width: "90%",             // take full width of parent
                    maxWidth: 1200,            // limit max width
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                   marginTop: 0,*/

                    p: 0,
  width: "90%",
  maxWidth: 1200,
  boxSizing: "border-box",
  backgroundColor: "transparent",
  marginTop: 0,
  mx: "auto",   

                    
                }}
            >
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
                                          <div style={{ height:"500px", width:"100%" ,backgroundColor:"transparent" }}></div>
                                  </Stack>
                            </form>
                    
            </Paper>
            </>
}

export default DepartmentForm