import express from "express";
import { addLead, addManyLead,getAssignedLeads,getUnassignedLeads,employeesAllLeads,getAllLeads, deleteLead,restoreLead, assignLead,updateLead,negativedLead,closedLead ,UnclosedLead,UnnegativedLead,unassignLeads} from "../controllers/lead.controller.js";

const leadRouter = express.Router()

leadRouter.post("/add/:id",addLead);  
leadRouter.post("/addmany/:id",addManyLead);
leadRouter.get("/getall/:id",getAllLeads);
leadRouter.get("/getAssignedLeads/:id",getAssignedLeads);
leadRouter.get("/getUnassignedLeads/:id",getUnassignedLeads);
leadRouter.get("/empgetall/:id",employeesAllLeads);
// leadRouter.get("/get/:id",getLeadById);
leadRouter.put("/update/:id",updateLead);
leadRouter.put("/delete/:id",deleteLead);
leadRouter.put("/restore/:id",restoreLead);
leadRouter.put("/assign",assignLead);
leadRouter.put("/unassign",unassignLeads);
leadRouter.put("/negative/:id",negativedLead);
leadRouter.put("/closed/:id",closedLead);
leadRouter.put("/unclosed/:id",UnclosedLead);
leadRouter.put("/UnnegativedLead/:id",UnnegativedLead);

export default leadRouter

