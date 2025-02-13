import express from "express";
import { addLead, addManyLead,getAllLeads, getLeadById, deleteLead,restoreLead, assignLead,updateLead,negativedLead,closedLead ,UnclosedLead,UnnegativedLead} from "../controllers/lead.controller.js";

const leadRouter = express.Router()

leadRouter.post("/add/:id",addLead);  
leadRouter.post("/addmany/:id",addManyLead);
leadRouter.get("/getall/:id",getAllLeads);
leadRouter.get("/get/:id",getLeadById);
leadRouter.put("/update/:id",updateLead);
leadRouter.put("/delete/:id",deleteLead);
leadRouter.put("/restore/:id",restoreLead);
leadRouter.put("/assign",assignLead);
leadRouter.put("/negative/:id",negativedLead);
leadRouter.put("/closed/:id",closedLead);
leadRouter.put("/unclosed/:id",UnclosedLead);
leadRouter.put("/UnnegativedLead/:id",UnnegativedLead);

export default leadRouter

