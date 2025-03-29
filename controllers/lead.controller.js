import Admin from "../models/admin.model.js";
import Employee from "../models/employee.model.js";
import Lead from "../models/lead.model.js";

export const addLead = async (req, res) => {
    try {
        const addedBy = req.params.id;
        const { name, phone, priority, sources, userType,leadAssignedTo } = req.body;
        console.log(userType);
        if (!phone) {
            res.status(400).json({  
                message: "phone is an required feild!",
                success: false
            })
        }
        let isExistAddedBy = await Admin.findOne({ _id: addedBy }) || await Employee.findOne({ _id: addedBy });
        if (!isExistAddedBy) {
            return res.status(400).json({
                message: "Invalid addedBy Id !",
                success: false,
            })
        }

        const newLead = await Lead.create({
            name: name,
            phone: phone,
            priority: priority,
            sources: sources,
            addedBy,
            leadAssignedTo:leadAssignedTo,
            addedByType:userType === "Employee" ? "Employee" :"Admin"
        })
        return res.status(201).json({
            message: "Lead Added Successfully!",
            lead: newLead,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error! at the time of adding lead.",
            success: false
        })
    }
}
export const addManyLead = async (req, res) => {
    
    try {
        const addedBy = req.params.id;
        const { leadsArray, userType} = req.body; // Leads is an array
        // console.log(leadsArray, "id: ", addedBy, "user", userType);
        // Validate input
        if (!leadsArray || !Array.isArray(leadsArray) || leadsArray.length === 0) {
            return res.status(400).json({
                message: "Leads array is required and cannot be empty!",
                success: false,
            });
        }
        
        const leads = [];
       

        
        const existingPhones = await Lead.find({ phone: { $in: leadsArray.map(lead => lead.phone) } }).select("phone");
        
        const existingPhonesSet = new Set(existingPhones.map(lead => lead.phone));

        
        for (const lead of leadsArray) {
            if (!lead.phone) {
                return res.status(400).json({ // Changed 404 to 400 (bad request)
                    message: "Each lead must have a phone field!",
                    success: false
                });
            }

            if (!existingPhonesSet.has(lead.phone)) {
                // Create a new object to avoid modifying the original reference
                leads.push({
                    ...lead,
                    addedBy,
                    addedByType: userType
                });
            }
        }

        // If no new leads to insert
        if (leads.length === 0) {
            return res.status(200).json({
                message: "No new leads to add!",
                success: true
            });
        }

        console.log("New Leads to Insert:", leads);

        // Insert new leads in bulk
        const insertedNewLeads = await Lead.insertMany(leads);

        return res.status(201).json({
            message: "Lead(s) Added Successfully!",
            leads: insertedNewLeads,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error! at the time of adding leads in bulk.",
            success: false
        });
    }
};

export const getAllLeads = async (req, res) => {
    try {
        const addedBy = req.params.id;
        const leads = await Lead.find({addedBy:addedBy}).populate('leadAssignedTo');
        if (!leads) {
            return res.status(404).json({
                message: "Leads Not Found!, Not registered any lead yet.",
                success: false
            });
        }
        return res.status(201).json({
            message: "These are the registered leads !",
            success: true,
            leads
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of fetching all leads",
            success: false
        });
    }
}
export const getLeadById = async (req, res) => {
    try {
        const addedBy = req.params.id;
        const {leadId} = req.body;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        const lead = await Lead.findOne({ _id: leadId, addedBy:addedBy });
        if (!lead) {
            return res.status(404).json({
                message: "Leads Not Found!",
                success: false
            });
        }
        return res.status(200).json({
            message: "These are the registered leads !",
            lead,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of fetching lead By id",
            success: false
        });
    }
}

export const deleteLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{deleted:true}});
        return res.status(200).json({
            message: "Lead Deleted Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of Deleting lead",
            success: false
        })
    }

}
export const restoreLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        // const {leadId} = req.body;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{deleted:false}});
        return res.status(200).json({
            message: "Lead Restored Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of restoring lead",
            success: false
        })
    }

}


export const assignLead = async (req, res) => {
    try {
        const {leadsArray, empId} = req.body;
        if(!leadsArray || !Array.isArray(leadsArray) || leadsArray.length === 0 || !empId){
            return res.status(404).json({
                message:"Leads Array and Employee Id is required!",
                success:false
            })
        }
        // Check if the employee exists
        
    const employee = await Employee.find({_id:empId});
    if (!employee) {
      return res.status(404).json({ 
        message: 'Employee not found',
        success:false
       });
    }
    const updatedLeads = await Lead.updateMany({_id:{$in:leadsArray}},{$set:{leadAssignedTo:empId}})
    return res.status(200).json({ 
        message: 'Leads assigned successfully', 
        updatedLeads,
        success:true
     });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of Assigning lead to and Emplployee",
            success: false
        });
    }
}


export const updateLead = async(req,res)=>{
    try {
        const leadId = req.params.id;
        console.log(leadId);
        
        const { name, priority,sources, email, gender, dob, country, state, city, zipCode, leadStatus,tags} = req.body;
        const lead = await Lead.findOne({_id:leadId})
        console.log(lead);
        
        if(!lead){
            return res.status(404).json({message:" id not found",success:false})
        }
        if(name) lead.name = name ;
        if(priority) lead.priority = priority;
        if(email) lead.email = email;
        if(gender) lead.gender = gender;
        if(dob) lead.dob = dob;
        if(sources) lead.sources = sources;
        if(country) lead.country = country;
        if(state) lead.state = state;
        if(city) lead.city = city;
        if(zipCode) lead.zipCode = zipCode;
        if(leadStatus) lead.leadStatus = leadStatus;
        if(tags) lead.tags = tags
        
        await  lead.save();
        return res.status(201).json({
            message: "Lead Updated Successfully!",
            lead,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of Updating lead!.",
            success: false
        });
    }
}

export const closedLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        // const {leadId} = req.body;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{closed:true}});
        return res.status(200).json({
            message: "Lead Closed Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of Closing lead",
            success: false
        })
    }

}

export const UnclosedLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{closed:false}});
        return res.status(200).json({
            message: "Lead Unclosed Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of Unclosing lead",
            success: false
        })
    }

}

export const negativedLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        // const {leadId} = req.body;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{negative:true}});
        return res.status(200).json({
            message: "Mark as Negative Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of marks as Negative lead",
            success: false
        })
    }

}
export const UnnegativedLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        // const {leadId} = req.body;
        if (!leadId) {
            return res.status(404).json({
                message: "Lead Id not Found",
                success: false
            })
        }
        await Lead.findByIdAndUpdate({_id:leadId}, {$set:{negative:false}});
        return res.status(200).json({
            message: "Mark as Negative Successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error!, at the time of marks as Negative lead",
            success: false
        })
    }

}