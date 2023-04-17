import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/global';
import { Procedure } from '../models/procedure.model';
import { IProcedureWithCareGiver } from '../models/types/caregiver.types';
import { NotFoundError } from '../utils/errors';

const addNewProcedure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {
        name,
        description,
        price
    } = req.body

    const procedure_data = {
        name,
        description,
        price,
        care_giver: await req.user.profile._id
    }

    const procedure = await Procedure.create(procedure_data)

    res.status(201).send({
        message: 'Procedure created successfully',
        success: true,
        data: {
            procedure: await procedure.populate('care_giver')
        }
    })
}

const getProcedures = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const care_giver_id = req.query.care_giver_id

    const procedures = await Procedure.find({ care_giver: care_giver_id, hidden: false })

    res.status(200).send({
        message: 'Procedures fetched successfully',
        success: true,
        data: {
            procedures
        }
    })
}

const getProcedure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const procedure_id = req.query.procedure_id

    const procedure = await Procedure.findOne({ _id: procedure_id, hidden: false }).populate<IProcedureWithCareGiver>('care_giver')

    if (!procedure) {
        return next(new NotFoundError('Procedure not found'))
    }

    res.status(200).send({
        message: 'Procedure fetched successfully',
        success: true,
        data: {
            procedure
        }
    })

}

const updateProcedure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const procedure_id = req.query.procedure_id

    const procedure = await Procedure.findByIdAndUpdate(
        procedure_id, { ...req.body }, { new: true }
    ).populate<IProcedureWithCareGiver>('care_giver')

    if (!procedure) {
        return next(new NotFoundError('Procedure not found'))
    }

    res.status(200).send({
        message: 'Procedure updated successfully',
        success: true,
        data: {
            procedure
        }
    })
}

const deleteProcedure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const procedure_id = req.query.procedure_id

    const procedure = await Procedure.findByIdAndUpdate(procedure_id, { hidden: true })

    if (!procedure) {
        return next(new NotFoundError('Procedure not found'))
    }

    res.status(200).send({
        message: 'Procedure deleted successfully',
        success: true,
        data: {
            procedure
        }
    })
}

export {
    addNewProcedure,
    getProcedures,
    getProcedure,
    updateProcedure,
    deleteProcedure
}