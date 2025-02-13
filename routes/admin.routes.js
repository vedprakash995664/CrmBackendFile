import { registerAdmin, adminLogin, getAllAdmins, getAdminById, blockeAdmin, unBlockAdmin } from "../controllers/admin.controller.js";
import express from "express";
const adminRouter = express.Router();

adminRouter.post("/add/:id", registerAdmin)
adminRouter.post("/login", adminLogin)
adminRouter.get("/getall", getAllAdmins)
adminRouter.get("/getone/:id", getAdminById)
adminRouter.put("/block/:id", blockeAdmin)
adminRouter.put("/unblock/:id", unBlockAdmin)

export default adminRouter