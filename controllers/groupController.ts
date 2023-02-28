import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { IGroup } from "../db/models/IGroup";
import GroupTable from "../db/schemas/groupSchema"; 

/**
* 1. @Usage : Get all groups
*    @Method : GET
*    @URL : http://localhost:9000/groups/
*    @params : No-params
*    @access : PUBLIC
*/
export const getAllGroups = async(request:Request, response:Response) => {
    try{
        const groups:IGroup[] = await GroupTable.find();
         return response.status(200).json(groups);
    } catch (error:any) {
        return response.status(500).json({
            msg : "error.message"
        });
    }    
}; 

/**
* 2. @Usage : Get Group
*    @Method : GET
*    @URL : http://localhost:9000/groups/:groupId
*    @params : No-params
*    @access : PUBLIC
*/
export const getGroup = async(request:Request, response:Response) => {
    try{
       const {groupId} = request.params;
       const mongoGroupId = new mongoose.Types.ObjectId(groupId);
       const group:IGroup | undefined | null = await GroupTable.findById(mongoGroupId);
       if(!group){
        return response.status(404).json({
            msg : "Group not Found"
          });
       }
       return response.status(200).json(group);
  
    }
    catch (error:any) {
        return response.status(500).json({
            msg : "error.message"
        });
    }    
};

/**
* 3. @Usage : Create a  group
*    @Method : Post
*    @URL : http://localhost:9000/groups/
*    @params : name 
*    @access : PUBLIC
*/
export const createGroup = async(request:Request, response:Response) => {
    try{ 
        // validate the form
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        // read the form data
        const {name} = request.body;
        // check if the group exists in the db
        const group: IGroup | undefined | null= await GroupTable.findOne({name: name});
        if (group){
            return response.status(401).json({
                msg : "Group is already exists! "
            });
        }
        // create a group
        const theGroup: IGroup | undefined | null = await new GroupTable<IGroup>({name: name }).save();
        if (theGroup){
            return response.status(200).json({
                msg : "Group Created",
                group : theGroup
            });

        }
    }
    catch (error:any) {
        return response.status(500).json({
            msg : "error.message"
        });
    }    
};