import { addEmployee, loginEmployee, updateEmployee, getAllEmployees, getEmployeeById, blockEmployee, unBlockEmployee } from "../controllers/employee.controller.js";
import express from "express";

const employeeRouter = express.Router();

employeeRouter.post('/add/:id',addEmployee);
employeeRouter.put('/update/:id',updateEmployee);
employeeRouter.post('/login',loginEmployee);
employeeRouter.get('/getall/:id', getAllEmployees);
employeeRouter.get('/getone/:id', getEmployeeById);
employeeRouter.put("/block/:id", blockEmployee);
employeeRouter.put("/unblock/:id", unBlockEmployee);


export default employeeRouter;  