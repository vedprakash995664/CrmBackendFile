import Admin from "../models/admin.model.js";
import superAdmin from "../models/superAdmin.model.js";

// this action done by the superadmin
export const registerAdmin = async (req, res) => {
    try {
        const addedBy = req.params.id;
        const { 
            name, 
            mobile, 
            email, 
            password,
            DateOfBirth,
            gender,
            companyName,
            companyType,
            street,
            city,
            state,
            country,
            zipCode} = req.body;
        if (!name || !mobile || !email || !password) {
            return res.status(400).json({
                message: "Something is missing, All feilds are required !",
                success: false
            })
        }
        let existAddedBy = await superAdmin.findOne({ _id: addedBy });
        if (!existAddedBy) {
            return res.status(400).json({
                message: "Invalid addedBy Id !",
                success: false,
            })
        }

        let existUser = await Admin.findOne({ mobile: mobile });
        if (existUser) {
            return res.status(400).json({
                message: "A user already exist with this user mobile number !",
                success: false,
            })
        }
        existUser = await Admin.findOne({ email: email });;
        if (existUser) {
            return res.status(400).json({
                message: "A user already exist with this user email !",
                success: false,
            })
        }
        const user = await Admin.create({
            name,
            mobile,
            email,
            password,
            gender,
            DateOfBirth,
            companyName,
            companyType,
            street,
            city,
            state,
            country,
            zipCode,
            addedBy
        })
        
        return res.status(201).json({
            message:"Admin registered Successfuly!",
            existUser,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error, while adding admin!",
            success: false,
        })
    }
}


export const adminLogin =  async (req, res)=>{
    try {
        const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Some Credencials are missing!",
            success:false
        })
    }
    const existUser = await Admin.findOne({
        $or: [{ email: email, password:password }, 
            { mobile: email, password:password }]
        });
    if(!existUser){
        return res.status(400).json({
            message:"Please Enter Currect Credentials !",
            success:false,
        })
    }
    return res.status(200).json({
        message:"logedin successful",
        existUser:existUser,
        success:true,
    })
    } catch (error) {
      return res.status(500).json({
        message:error.message  || "Internal server error, while Login Admin!",
        success:false
      })  
    }
}

// getAllAdmins
// this action done by the superadmin

export const getAllAdmins = async (req, res)=>{
    try {
        const allAdmins = await Admin.find().populate("addedBy");
        if(!allAdmins || allAdmins.length === 0){
            return res.status(404).json({
                message:"Admins not found!",   
                success:false
            })
        }
        return res.status(200).json({
            message:"These are registered Admins",
            admins:allAdmins,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, while fetching all admins!",
            success:false
        })
    }
}
export const getAdminById = async (req, res)=>{
    try {
        const adminId = req.params.id;
        const admin = await Admin.findOne({_id:adminId}).populate("addedBy");
        if(!admin){
            return res.status(404).json({
                message:"Invalid Admin Id!",
                success:false
            })
        }
        return res.status(200).json({
            message:"This are registered Admins",
            admin,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, while fetching admin by id!",
            success:false
        })
    }
}

export const blockeAdmin = async (req, res)=>{
    try {
        const adminId = req.params.id;
        if(!adminId){
            return res.status(404).json({
                message:"Admin Not Found!",
                success:false
            })
        }
       await Admin.findByIdAndUpdate({_id:adminId}, {$set:{blocked:true}});
        return res.status(200).json({
        message:"Admin Bocked Successfuly!",
        success:true
    })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error! while blocking admin",
            success:false
        })
    }
}

export const unBlockAdmin = async (req, res)=>{
    try {
        const adminId = req.params.id;
        if(!adminId){
            return res.status(404).json({
                message:"Admin Not Found!",
                success:false
            })
        }
       await Admin.findByIdAndUpdate({_id:adminId}, {$set:{blocked:false}});
        return res.status(200).json({
        message:"Admin unBocked Successfuly!",
        success:true
    })
    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error! while unblocking admin",
            success:false
        })
    }
}


export const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updateFields = req.body; // Fields to update

        if (!adminId) {
            return res.status(400).json({
                message: "Admin ID is required!",
                success: false
            });
        }

        // Check if the admin exists
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({
                message: "Admin not found!",
                success: false
            });
        }

        // Update the admin with the provided fields
        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { $set: updateFields },
            { new: true } // Return updated admin
        );

        return res.status(200).json({
            message: "Admin updated successfully!",
            updatedAdmin,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error! while updating admin",
            success: false
        });
    }
};
