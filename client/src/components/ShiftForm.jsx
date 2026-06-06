import { useForm, Controller } from "react-hook-form";
import {useState,useEffect } from "react";
import {Button,TextField,Alert,Stack, Typography,Paper,Select,
    MenuItem,FormControl,FormHelperText} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import { Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { useShiftForm } from "../custom_hooks/useShiftForm";

import Grid from "@mui/material/Grid";
import {LocalizationProvider,DateTimePicker,} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";


dayjs.extend(utc);

const ShiftForm =({onSubmitHandler}) =>{

  const shiftForm = useForm({ defaultValues: { id:"",startDate: "", endDate:"",newShiftEmployees:[] }, });
  const { handleSubmit,control,formState: { errors },reset, setError}  = shiftForm;  
  
  const { selectedShift,fetchShift} = useShiftForm();
  const [feedbackMsg, setFeedbackMsg] =useState("");

  const { shiftId } = useParams();
  const navigate = useNavigate();

  useEffect( ()=>
  {
    if (shiftId)
    {
        fetchShift(shiftId);
    }
  },[shiftId]);


  useEffect(() => 
  {
      if (selectedShift ) {
              reset({
                  id: selectedShift.id,
                  startDate: dayjs(selectedShift.startDate).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"), 
                  endDate: dayjs(selectedShift.endDate).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                  newShiftEmployees:[],
              });
          }
  }, [selectedShift,reset]);


  const onSubmit = async (data) => 
  {    
        const ok = await onSubmitHandler(data,setError);
        if (ok) 
        {
           setFeedbackMsg( shiftId ? "Shift updated successfully": "Shift added successfully");
            reset();
            setTimeout(() => {
                navigate("/shifts");
            }, 1500);
        }
  };

    

  return (
      <Paper elevation={0} sx={{ p: 0, width: "90%", maxWidth: 1200, boxSizing: "border-box", 
                                backgroundColor: "transparent",mx: "auto",mt: 2,mb: 2}} 
      >         
            
            {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}  
            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}      

            <form onSubmit={handleSubmit(onSubmit)} style={{backgroundColor:"transparent",border:"2px solid #C19A6B",borderRadius:"10PX", padding:"10px",width:"100%"}}>
               <Typography variant="h5" align="center" sx={{ mb: 2, width:180, flexShrink:0 }}>
                  { shiftId ? 'Edit a Shift': 'Add a New Shift'}
                </Typography>

               {selectedShift && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{
                        width: "100%",
                        mt: 1,
                        alignItems: { xs: "flex-start", sm: "center" },
                      }}
                    >
                      <Typography sx={{ width: 180, flexShrink: 0 }}>
                        Shift Id:
                      </Typography>

                      <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                        <Typography variant="body2">
                          {shiftId}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ width: "100%" ,mt:2,mb:2,alignItems:{ xs: "flex-start", sm: "center" }}}>
                      <Typography  sx={{ width: 180, flexShrink: 0 }}>Start Date & Time:</Typography>
                        <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                      <Controller
                            name="startDate"
                            control={control}
                            rules={{
                              required: "Start date is required",
                            }}
                            render={({ field }) => (
                              <DateTimePicker
                                label="Start Date & Time"
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(value) =>
                                  field.onChange(
                                     value ? value.utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : ""
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    error: !!errors.startDate,
                                    helperText: errors.startDate?.message,
                                  },
                                }}
                              />
                            )}
                          />  
                          </Box>                  
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}  sx={{ width: "100%" ,mt:3,mb:2,alignItems:{ xs: "flex-start", sm: "center" }}}>
                      <Typography  sx={{ width: 180, flexShrink: 0 }}>End Date & Time:</Typography>
                        <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                      <Controller
                            name="endDate"
                            control={control}
                            rules={{
                              required: "End date is required",
                            }}
                            render={({ field }) => (
                              <DateTimePicker
                                label="End Date & Time"
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(value) =>
                                  field.onChange(
                                     value ? value.utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : ""
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    error: !!errors.endDate,
                                    helperText: errors.endDate?.message,
                                  },
                                }}
                              />
                            )}
                          />  
                          </Box>                  
                </Stack>            

                <Stack direction="row" spacing={1}  sx={{ alignItems:"flex-start"}}>
                      <Controller name="id" control={control} defaultValue=""
                        render={({ field }) => (<input type="hidden" {...field} />)}
                      />
                </Stack>

                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start", mt: 1 , textTransform:"capitalize"}}>
                    {selectedShift ? 'Update Shift':'Add Shift'}
                </Button>
            </LocalizationProvider>
          </form>
    </Paper>  
  )
}

export default ShiftForm