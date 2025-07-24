# 🏭 Factory Management System - REST API

This project is a Node.js + Express REST API server for managing a factory's employees, departments, and work shifts.  
It uses **MongoDB Atlas** as the database and is deployed for live demo on **Render**.

> 📎 The project fulfills the functional and technical requirements defined in 
[`factory/docs/factory_requirements_doc.pdf`](factory/docs/factory_requirements_doc.pdf).  
> 📎 A full mapping between client pages and backend endpoints is provided in
 [`factory/docs/factory_web_pages_to_api_map.pdf`](factory/docs/factory_web_pages_to_api_map.pdf).

---

## 🔗 Live Demo

**Base URL**:  
[https://factory-hiqy.onrender.com/](https://factory-hiqy.onrender.com/)

⚠️ **Important**:  
Since the app is hosted on Render's free plan, the server goes to sleep after periods of inactivity.  
Expect a **~1-minute delay** on the **first request** after a long pause.

You can watch the API status at:  
[https://factory-hiqy.onrender.com/](https://factory-hiqy.onrender.com/)  
When loaded, the API returns the message:  
API is running. 

Please wait up to 1 minute for the api to load . After the api is loaded , you can send request with no further delay. 
---

## 🧰 Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: External validation via [JSONPlaceholder users API](https://jsonplaceholder.typicode.com/users/)
- **Deployment**: Render (Free tier)

---

## 📂 Project Documentation

factory/
├── docs/
│ ├── factory_requirements_doc.pdf
│ ├── factory_web_pages_to_api_map.pdf
│ ├── postman_screenshots/
│ ├── auth_request_examples.txt
│ ├── department_request_examples.txt
│ ├── employee_request_examples.txt
│ └── shift_request_examples.txt

## ✅ Features

- User login based on external API (JSONPlaceholder): https://jsonplaceholder.typicode.com/users/
- Action limit per user per day (auto-logout when exceeded)
- Full CRUD for:
  - Employees
  - Departments
  - Shifts (except delete)
- Cross-references:
  - Employees belong to departments
  - Employees are assigned to multiple shifts
  - Departments can be updated with employee reassignments

---

## 📄 API Documentation

The API implements routes for login, employee/departments/shifts management, and user action tracking.

For examples of requests and payloads:

- 📬 Auth examples: `docs/auth_request_examples.txt`
- 👷 Employee examples: `docs/employee_request_examples.txt`
- 🏢 Department examples: `docs/department_request_examples.txt`
- ⏱️ Shift examples: `docs/shift_request_examples.txt`

For screenshots of actual requests made via Postman, see:  
📸 `docs/postman_screenshots/`

---

## 🧪 How to Use the Demo

1. Use any of the users listed here to log in:  
   https://jsonplaceholder.typicode.com/users/
   
2. After login:
   - You have a limited number of actions per day (each API call counts).
   - Once your quota is exceeded, you will be logged out automatically for the day.

---

## 🧭 Client–Server Mapping

A full overview of how frontend pages map to backend API methods is available in:  
📄 `factory/docs/factory_web_pages_to_api_map.pdf`

---
