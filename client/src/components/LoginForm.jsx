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

const LoginForm =() =>
{
  const loginForm = useForm({ defaultValues: { username: "Bret", email: "Sincere@april.biz",} });
 //  const loginForm = useForm({ defaultValues: { username: "Maxime_Nienow", email: "Sherwood@rosamond.me",} });
  const { handleSubmit, control, formState: { errors, isSubmitSuccessful }, reset, setError,} = loginForm;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const reason = location.state?.reason;

  

  const { setUser } = useContext(UserContext);

  const handleClickShowPassword = () => 
  {
    setShowPassword((prev) => !prev);
  };


  const onSubmit = async (data) => {

    try {

        const trimmedData = {
            username: data.username.trim(),
            email: data.email.trim()
        };

        const res = await sendLoginData(trimmedData);
        console.log('res:',res)  ;
        reset();

       setUser(res.user);
      navigate("/departments", {
            replace: true,
        }); 

    }
    catch(err) {

       console.log("login err", err);
       const data = err.response?.data;

        if (data?.errorField) {

            setError(data.errorField, {
                type: "server",
                message: data.message
            });

        } else {

            setError("root", {
                type: "server",
                message: data?.message || "Login failed"
            });
        }
    }
};
 

useEffect(() => {
  if (reason === "dailyLimit") {
    setError("root", {
      type: "server",
      message: "Your daily limit has been reached. You may login starting from tomorrow"
    });
  }
}, [reason, setError]);


  return (
    <Box sx={{   width: { xs: "90%",sm: "70%",md: "70%", lg: "40%",}, mx: "auto", mt: 5,p: 3, boxShadow: 3, borderRadius: 2,
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
              Login
            </Button>

            
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default LoginForm;