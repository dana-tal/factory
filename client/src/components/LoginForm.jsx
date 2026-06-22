import { useForm, Controller } from "react-hook-form";
import { Box,Button,TextField,Typography,Alert,Stack,IconButton,InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { sendLoginData } from '../utils/authRequest.js'; 

import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";
import { useContext,useEffect } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import axios from "axios";

const LoginForm =() =>
{
  const loginForm = useForm({ defaultValues: { username: "", email: "",} });
  const { handleSubmit, control, formState: { errors, isSubmitSuccessful }, reset, setError,} = loginForm;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGuestLoading , setIsGuestLoading] = useState(false);

  const location = useLocation();
  const reason = location.state?.reason;

  

  const { setUser } = useContext(UserContext);

  const handleClickShowPassword = () => 
  {
    setShowPassword((prev) => !prev);
  };

  const warmUpServer = () => {
  axios.get(`${import.meta.env.VITE_APP_DOMAIN}/`, {
    withCredentials: true,
  }).catch(() => {
    // ignore errors - warm-up only
  });
};

  const loginHandler = async (data)=>{
      try
      {
          const res = await sendLoginData(data);
          console.log('res:',res)  ;
          reset();

          setUser(res.user);
          navigate("/departments", {replace: true,}); 
      }
      catch(err)
      {
          console.log("login err", err);
          const data = err.response?.data;

          if (data?.errorField) 
          {
            setError(data.errorField, {type: "server",message: data.message});
          }
          else
          {
            setError("root", {type: "server",message: data?.message || "Login failed"});
          }
      }
  }

  const handleGuestLogin= async ()=>{
      console.log("guest login");
    
      const data = { username: import.meta.env.VITE_GUEST_USERNAME , email: import.meta.env.VITE_GUEST_EMAIL };
      setIsGuestLoading(true);
      await loginHandler(data);
      setIsGuestLoading(false);
  }

  const onSubmit = async (data) => {

      const trimmedData = {
            username: data.username.trim(),
            email: data.email.trim()
        };
      setIsLoginLoading(true);
      await loginHandler(trimmedData);
      setIsLoginLoading(false);

};
 
useEffect(() => {
  warmUpServer();
}, []);


useEffect(() => {
  if (reason === "dailyLimit") {
    setError("root", {
      type: "server",
      message: "Your daily limit has been reached. You may login starting from tomorrow"
    });
  }
}, [reason, setError]);


  return (
    <Box sx={{   width: { xs: "90%",sm: "70%",md: "70%", lg: "40%",}, mx: "auto", mt: 5,p: 3, boxShadow: 0, borderRadius: 2,
        backgroundColor: "#F8F6F0", minHeight: { xs: "400px", sm: "500px", md: "500px", lg: "500px", }, alignItems: "center", display: "flex" }}
    >
      <Box sx={{ width: "100%" }}>
        {errors.root && ( <Alert severity="error">{errors.root.message}</Alert>)}

        {isSubmitSuccessful && (<Alert severity="success">Login successful!</Alert>)}

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontSize: "20px", whiteSpace: "nowrap", }} >
                Factory Management System 
            </Typography>

            <Stack
              direction="row"
              sx={{ alignItems:"center" }}
              spacing={2}
            >
              <Typography sx={{ width: 120 }}>
                Username:
              </Typography>

              <Controller
                name="username"
                control={control}
                rules={{
                  required: "username is required",

                  minLength: {
                    value: 3,
                    message:
                      "username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[^\s]+$/,
                    message:
                      "username cannot contain spaces",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}                   
                    size="small"
                    fullWidth
                    error={!!errors.username}
                    helperText={
                      errors.username?.message
                    }
                  />
                )}
              />
            </Stack>

            <Stack direction="row" sx={{ alignItems: "center" }} spacing={2} >
            <Typography sx={{ width: 120 }}>
              Email:
            </Typography>

            <Controller name="email" control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  size="small"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Stack>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                alignSelf: "flex-start",
              }}
            >
              {isLoginLoading? "Please wait, waking up the server...":"Login"}
            </Button>

              <Divider sx={{ my: 2, fontFamily:"Arial",fontSize: "20px",   '&::before, &::after': {
      borderColor: 'black',
    }, }} > Or </Divider>
            

              <Button
              fullWidth
              type="button"
              variant="contained"
              color="info"
               sx={{
                mt: 2,
                alignSelf: "flex-start",
              }}
              onClick={handleGuestLogin}
            >
             { isGuestLoading ? "Please wait, waking up the server...":"Continue As Guest"}
            </Button>


          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default LoginForm;