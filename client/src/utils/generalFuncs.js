
const DOMAIN = import.meta.env.VITE_APP_DOMAIN;


import axios from "axios";

const api = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});


// Response interceptor
api.interceptors.response.use(

  // Success
  (response) => {
    return response;
  },

  // Error
  (error) => {

    console.log("interceptors, error.response:",error.response)
    if (error.response) {

      // Server returned error status
      switch (error.response.status) {

        case 400:
          console.log("Bad Request");
          break;

        case 401:
          console.log("Unauthorized");
          break;

        case 403:
          console.log("Forbidden");
          break;

        case 500:
          console.log("Server error");
          break;

        default:
          console.log("Unknown error");
      }

    } 
    else if (error.request) 
    {

      // Request was sent but no response
      console.log("No response from server");

    } 
    else 
    {

      // Something else
      console.log("Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);



function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // Check if the original string contains time information
  const hasTime = /T|\d{2}:\d{2}/.test(dateString);

  if (!hasTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const capitalize = (str) =>
  str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";

export {
    DOMAIN,
    formatDate,
    capitalize,
    api
}