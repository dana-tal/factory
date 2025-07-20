const errlogger = require('../utils/logger');
const validator = require('../utils/validator');
const shiftsService = require('../services/shiftsService');
const usersService = require('../services/usersService');

const getAllShifts = async (req,res)=>{

    try
    {
        const shifts = await shiftsService.getAllShifts();
        if (!shifts)
        {
            res.status(204).json('The request was successfull, but there are no shifts yet');
        }
        await usersService.logUserAction(req.user.userId,"getAllShifts");
        return res.status(200).json(shifts);
    }
    catch(err)
    {
        errlogger.error(`getAllShifts failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);  
    }

}

const getShiftById = async (req,res)=> {

    try
    {
        const id = req.params.id;

        const result = validator.validateEntityId(id,'Shift');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }
        const shift = await shiftsService.getShiftById(id);
        if (!shift)
        {
            return res.status(404).json(`A shift with id: ${id} does not exist`);
        }
        await usersService.logUserAction(req.user.userId,"getShiftById");
        return res.status(200).json(shift);
    }
    catch(err)
    {
         errlogger.error(`getShiftById failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }

}

const getShiftEditInfo =  async (req,res)=> {

    try
    {
        const id = req.params.id;

        const result = validator.validateEntityId(id,'Shift');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }
        const shift = await shiftsService.getShiftEditInfo(id);
        if (!shift)
        {
            return res.status(404).json(`A shift with id: ${id} does not exist`);
        }
        await usersService.logUserAction(req.user.userId,"getShiftEditInfo");
        return res.status(200).json(shift);
    }
    catch(err)
    {
         errlogger.error(`getShiftEditInfo failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }
}

const addNewShift = async (req,res)=> {
    try
    {
       let i,key,dateResult, info ={} ; 
       const keys = ['startDate','endDate'];

       if (! req.body)
       {
            return res.status(400).json({error:'Request body is missing'});
       } 
      
       for (i=0; i< keys.length; i++)
       {
            key = keys[i];
            dateResult = validator.isValidDateInput(req.body,key,true);
            if (dateResult.status !== 'O.K')
            {
                return res.status( dateResult.status).json(dateResult.message);
            }
            else 
            {
                info[key] = dateResult.dateObj;
            }
       }
       
        const result = await validator.validateShiftInfo( info['startDate'],info['endDate']); // logical checks of dates 
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        const newShift = await shiftsService.addNewShift({startDate: info['startDate'], endDate: info['endDate']});
        await usersService.logUserAction(req.user.userId,"addNewShift");
        return res.status(201).json(newShift);
    }
    catch(err)
    {
        errlogger.error(`addNewShift failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }
}

const updateShift = async (req,res)=>{
    try
    {
         let i,key,dateResult, info ={} ; 
         const keys = ['startDate','endDate'];

        if (! req.body)
        {
            return res.status(400).json({error:'Request body is missing'});
        }
         
       const id = req.params.id;

       let result = validator.validateEntityId(id,'Shift');
       if (result)
       {
            return res.status(result.status).json(result.message);
       }
        const existingShift = await shiftsService.getShiftById(id);
        if (!existingShift)
        {
            return res.status(404).json(`Shift with id ${id} does not exist`);
        }
       

        for (i=0; i< keys.length; i++)
        {
            key = keys[i];
            dateResult = validator.isValidDateInput(req.body,key,false);
            if (dateResult.status !== 'O.K')
            {
                return res.status( dateResult.status).json(dateResult.message);
            }
            else 
            {
                info[key] = dateResult.dateObj; // can be null , in case it was not provided
            }
        }

      
       const startDate =  info['startDate'] !==null ? info['startDate'] : existingShift.startDate;
       const endDate =    info['endDate'] !== null  ? info['endDate'] : existingShift.endDate;  
       

       result = await validator.validateShiftInfo(startDate,endDate); // validate dates logically 
       if (result)
       {
            return res.status(result.status).json(result.message);
       }
       
       const updatedShift = await shiftsService.updateShift(id,{ startDate,endDate });
        await usersService.logUserAction(req.user.userId,"updateShift");
       res.status(200).json(updatedShift);
    }
    catch(err)
    {
         errlogger.error(`updateShift failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }
}


module.exports = {
    getAllShifts,
    getShiftById,
    getShiftEditInfo,
    addNewShift,
    updateShift
}