import Employee from "../models/employee.model.js";
import Admin from "../models/admin.model.js";

export const addEmployee = async (req, res) => {
    try {
        const addedBy = req.params.id;
        const {
            empName,
            empPhoneNumber,
            empEmail,
            empPassword,
            empGender,
            empDOB,
            empCity,
            empState,
            empZipCode,
            empCountry,
            empDesignation
        } = req.body;

        // Check for required fields
        if (
            !empName ||
            !empPhoneNumber ||
            !empEmail ||
            !empPassword 
        ) {
            return res.status(400).json({
                message: "All fields are required! Please provide all the details.",
                success: false,
            });
        }

        // Verify if addedBy exists in the Admin collection
        const isExistAddedBy = await Admin.findOne({ _id: addedBy });
        if (!isExistAddedBy) {
            return res.status(400).json({
                message: "Invalid addedBy ID!",
                success: false,
            });
        }

        // Check if the employee already exists
        const isExist = await Employee.findOne({
            $or: [{ empPhoneNumber }, { empEmail }],
        });
        if (isExist) {
            return res.status(400).json({
                message: "An employee already exists with this email or phone number!",
                employee: isExist,
                success: false,
            });
        }

        // Create a new employee
        const newEmployee = await Employee.create({
            empName,
            empPhoneNumber,
            empEmail,
            empPassword,
            empGender,
            empDOB,
            empDesignation,
            empCity,
            empZipCode,
            empCountry,
            empState,
            addedBy,
        });

        return res.status(201).json({
            message: "Employee added successfully!",
            employee: newEmployee,
            success: true,
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        return res.status(500).json({
            message: error.message || "Internal server error at the time of adding employee.",
            success: false,
        });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id; 
        console.log("sidd",employeeId);
        
        const {
            empName,
            empPhoneNumber,
            empEmail,
            empPassword,
            empGender,
            empDOB,
            empDesignation,
            empCity,
            empState,
            empZipCode,
            empCountry,
            blocked,
        } = req.body; // Extract fields from the request body

        // Check if employeeId is valid and exists
        const isExistEmployee = await Employee.findById(employeeId);
        if (!isExistEmployee) {
            return res.status(404).json({
                message: "Employee not found! Invalid employeeId.",
                success: false,
            });
        }

        // Check for duplicate email or phone number if they are updated
        if (empPhoneNumber || empEmail) {
            const isDuplicate = await Employee.findOne({
                $or: [
                    { empPhoneNumber, _id: { $ne: employeeId } }, // Ensure phone doesn't belong to this employee
                    { empEmail, _id: { $ne: employeeId } }, // Ensure email doesn't belong to this employee
                ],
            });
            if (isDuplicate) {
                return res.status(400).json({
                    message: "An employee already exists with this email or phone number!",
                    success: false,
                });
            }
        }

        // Update employee details
        await Employee.findByIdAndUpdate(
            {_id:employeeId,empPassword},
            {
                empName,
                empPhoneNumber,
                empEmail,
                empGender,
                empDOB,
                empDesignation,
                empCity,
                empState,
                empCountry,
                empZipCode,
                blocked,
            },
            { new: true, runValidators: true } // Return updated document and run validation
        );

        if(!updateEmployee){
            return res.status(404).json({
                message: "Employee Not updated!",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Employee updated successfully!",
            success: true,
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        return res.status(500).json({
            message: error.message || "Internal server error while updating employee.",
            success: false,
        });
    }
};


export const loginEmployee = async (req,res)=>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({
                message:"Please Provide username or password!",
                success:false
            })
        } 
        const isExistEmployee = await Employee.findOne({$or:[{empPhoneNumber:username},{empEmail:username}]});
        if(!isExistEmployee){
            return res.status(400).json({
                message:"Employee is not registered with this username!",
                employee:isExist,
                success:false
            })
        }
        if(isExistEmployee.empPassword !== password){
            return res.status(400).json({
                message:"Please Enter a valid Password!.",
                success:false
            })
        }
        return res.status(200).json({
            message:"You are Logedin Successfully!.",
            employee:isExistEmployee,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal server error!, at the time of employee login.",
            success:false
        })
    }
}

export const getAllEmployees = async (req, res)=>{
    try {
        const addedBy = req.params.id;
        const employees = await Employee.find({addedBy:addedBy});
        if(!employees){
            return res.status(404).json({
                message:"Employees are not found in Database!.",
                success:false
            })
        }
        return res.status(200).json({
            message:"these Emaployees are registered here.",
            employees,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal server error!, at the time of fetching employees .",
            success:false
        })        
    }
}
export const getEmployeeById = async (req, res)=>{
    try {
        const addedBy = req.params.id;
        const {empId} = req.body;
        const employee = await Employee.findOne({_id:empId, addedBy:addedBy});
        if(!employee){
            return res.status(404).json({
                message:"Employee is not found in Database!.",
                success:false
            })
        }
        return res.status(200).json({
            message:"Emaployee Found.",
            employee,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal server error!, at the time of fetching employees .",
            success:false
        })        
    }
}

export const blockEmployee = async(req, res)=>{
    try {
        const addedBy = req.params.id;
        const {empId} = req.body;
        const blockedEmployee = await Employee.findByIdAndUpdate({_id:empId, addedBy:addedBy},{$set:{blocked:true}});
        if(!blockedEmployee){
            return res.status(404).json({
                message:"Employee is not found in Database!.",
                success:false
            })
        }
        return res.status(200).json({
            message:"Employee is blocked successfuly!",
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal server error!, at the time of blocking of an employees .",
            success:false
        })       
    }
}

export const unBlockEmployee = async(req, res)=>{
    try {
        const addedBy = req.params.id;
        const {empId} = req.body;
        const unBlockedEmployee = await Employee.findByIdAndUpdate({_id:empId, addedBy:addedBy},{$set:{blocked:false}});
        if(!unBlockedEmployee){
            return res.status(404).json({
                message:"Employee is not found in Database!.",
                success:false
            })
        }
        return res.status(200).json({
            message:"Employee is unBlocked successfuly!",
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal erver error!, at the time of unBlocking of an employees .",
            success:false
        })       
    }
}
