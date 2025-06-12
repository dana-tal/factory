const errlogger = require('../utils/logger');
const validator = require('../utils/validator');
const shiftsService = require('../services/shiftsService');
const { parseISO, isValid } = require('date-fns');

const getAllShifts = async (req,res)=>{

    try
    {
        const shifts = await shiftsService.getAllShifts();
        if (!shifts)
        {
            res.status(204).json('The request was successfull, but there are no shifts yet');
        }
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
        return res.status(200).json(shift);
    }
    catch(err)
    {
         errlogger.error(`getShiftById failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }

}

const addNewShift = async (req,res)=> {
    try
    {
       const startDate = parseISO(req.body.startDate);
       const endDate = parseISO(req.body.endDate);
   
        if (!isValid(startDate) || !isValid(endDate)) 
        {
            return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)' });
        }
        const result = await validator.validateShiftInfo( startDate,endDate);
      
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        /*
        const existingShift = await shiftsService.shiftExists(startDate, endDate);
        if (existingShift)
        {
            return res.status(409).json({ error:`A shift with ${ startDate.toISOString() } and ${endDate.toISOString() } already exists`});
        }
    */
        const newShift = await shiftsService.addNewShift({startDate, endDate});
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
       const shiftObj = req.body;

       const id = req.params.id;

       let result = validator.validateEntityId(id,'Shift');
       if (result)
       {
            return res.status(result.status).json(result.message);
       }
        const shift = await shiftsService.getShiftById(id);
        if (!shift)
        {
            return res.status(404).json(`Shift with id ${id} does not exist`);
        }
       
       const startDateProvided =  Object.prototype.hasOwnProperty.call(shiftObj, 'startDate');
       const endDateProvided =  Object.prototype.hasOwnProperty.call(shiftObj, 'endDate');

       //const shiftStart = parseISO(shiftObj.startDate)

       let shiftStartInput, shiftEndInput;

       if (startDateProvided  ) 
       {
            shiftStartInput =  parseISO(shiftObj.startDate);
            if ( !isValid(  shiftStartInput ) )
            {
                return res.status(400).json({ error: 'Invalid startDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)' });
            }
       }
       if( endDateProvided )
       {
             shiftEndInput =  parseISO(shiftObj.endDate);
             if ( !isValid(  shiftEndInput ) )
             {
                return res.status(400).json({ error: 'Invalid endDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)' });
             }
       }

       const startDate = startDateProvided ? shiftStartInput: shift.startDate;
       const endDate =   endDateProvided ? shiftEndInput: shift.endDate;

       result = await validator.validateShiftInfo(startDate,endDate);
       if (result)
       {
            return res.status(result.status).json(result.message);
       }
       
       const updatedShift = await shiftsService.updateShift(id,{ startDate,endDate });
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
    addNewShift,
    updateShift
}