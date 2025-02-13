import Followup from "../models/followup.model.js";
import Lead from "../models/lead.model.js";
import FollowupStatus from "../models/followupStatus.model.js";
import Priority from "../models/priority.model.js";
import Employee from "../models/employee.model.js";

import mongoose from 'mongoose';

export const addFollowup = async(req,res)=>{
    try {
        const leadId = req.params.id;
        console.log(leadId);
        const {status, priority, followedBy, message, reminder} = req.body;
        if(!leadId || !status || !priority || !followedBy || !message){
            return res.status(400).json({
                message:"Some required feilds are missing!",
                success:false
            });
        }
        const isExistLead = await Lead.findOne({_id:leadId})
        console.log(isExistLead);        
        if(!isExistLead){
            return res.status(400).json({
                message:"Invalid Lead id!",
                success:false
            });
        }
        if(isExistLead.deleted===true || isExistLead.negative===true || isExistLead.closed===true){
            return res.status(400).json({
                message:"Lead is  Delete or Neagtive Or Closed ",
                success:false
                });
        }

        const isExistFollowedBy = await Employee.findOne({_id:followedBy})
        if(!isExistFollowedBy){
            return res.status(400).json({
                message:"Invalid FollowedBy id!",
                success:false
            });
        }
        const newFollowup = await Followup.create({
            leadId:leadId,
            followupStatus:status,
            priority:priority,
            followedBy:followedBy,
            followupMessage:message,
            nextFollowupDate:reminder
        });

        return res.status(201).json({
            message:"Followup added successfully!.",
            newFollowup,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, at the time of adding followup!.",
            success:false
        })
    }
}


export const getFollowupById = async(req,res)=>{
    try {
        const followupId = req.params.id;
        if(!followupId){
            return res.status(400).json({
                message:"Followup Id Missing!",
                success:false
            });
        }
        
        const followup = await Followup.findOne({_id:followupId});
        return res.status(200).json({
            message:"Followup Fond!.",
            followup,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, at the time of getting followup by id!.",
            success:false
        })
    }
}
export const getFollowupByAddedBy = async(req,res)=>{
    try {
        const followedBy=req.params.id;
        const followups = await Followup.find({followedBy:followedBy}).populate('followedBy').populate('leadId');
        return res.status(200).json({
            message:"Followup Fond!.",
            followups,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, at the time of getting followups!.",
            success:false
        })
    }
}
export const getAllFollowup = async(req,res)=>{
    try {
        const leadId=req.params.id
        console.log(leadId);
        
        const followups = await Followup.find({leadId:leadId}).populate('followedBy').sort({ createdAt: -1 });;
        console.log(followups);
        
        return res.status(200).json({   
            message:"Followup Fond!.",
            followups,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || "Internal Server Error, at the time of getting followups!.",
            success:false
        })
    }
}

export const getNextFollowupByAddedBy = async (req, res) => {
    try {
        const followedBy = req.params.id;
        
        // Get all followups for this user
        const followups = await Followup.find({ followedBy: followedBy });
        
        // Extract unique lead IDs
        const leadIds = followups.map(followup => followup.leadId.toString());
        const uniqueLeadIds = [...new Set(leadIds)];
        
        // Find latest followup for each unique lead using aggregation
        const latestFollowups = await Followup.aggregate([
            // Match followups for our unique leads
            {
                $match: {
                    leadId: { $in: uniqueLeadIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            // Sort by createdAt in descending order (newest first)
            {
                $sort: { createdAt: -1 }
            },
            // Group by leadId and take the first (latest) document
            {
                $group: {
                    _id: "$leadId",
                    latestFollowup: { $first: "$$ROOT" }
                }
            },
            // Replace the root with the latest followup document
            {
                $replaceRoot: { newRoot: "$latestFollowup" }
            },
            // Lookup for followedBy (User) details
            {
                $lookup: {
                    from: 'users', // Replace with your actual users collection name
                    localField: 'followedBy',
                    foreignField: '_id',
                    as: 'followedBy'
                }
            },
            // Unwind the followedBy array
            {
                $unwind: {
                    path: '$followedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup for leadId details
            {
                $lookup: {
                    from: 'leads', // Replace with your actual leads collection name
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'leadId'
                }
            },
            // Unwind the leadId array
            {
                $unwind: {
                    path: '$leadId',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        return res.status(200).json({
            message: "Latest followups found successfully!",
            followups: latestFollowups,
            uniqueLeadsCount: uniqueLeadIds.length,
            success: true
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error while getting followups!",
            success: false
        });
    }
};



