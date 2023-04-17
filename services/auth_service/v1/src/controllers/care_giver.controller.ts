
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/global';
import { Doctor, IDoctor, IDoctorDoc } from '../models/user.model';
import { ICareGiverDoc, IDoctorWithClinic, IDoctorWithProcedures, IDoctorWithProceduresAndClinic } from '../models/types/caregiver.types';
import { NotFoundError } from '../utils/errors';
import { WithPopulated } from '../types';

const createDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {
        firstname, lastname,
        phone_number, number_of_patients,
        experience, medical_unit, biography,
        gender, procedures
    } = req.body

    const doctor_data = {
        firstname, lastname,
        phone_number, number_of_patients,
        experience, medical_unit, biography,
        gender, procedures, care_giver: await req.user.profile._id
    } as IDoctor

    const doctor = await Doctor.create(doctor_data)
    type DCP = IDoctorWithProceduresAndClinic
    const populated_doctor: DCP = await doctor.populate<DCP>('care_giver procedures')

    res.status(201).send({
        message: 'Doctor created successfully',
        success: true,
        data: {
            doctor: { ...populated_doctor.toObject(), hidden: undefined }
        }
    })
}

const getDoctorsProfiles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const care_giver_id = req.query.care_giver_id

    type DP = IDoctorWithProcedures
    const doctors: DP[] =
        await Doctor
            .find({ care_giver: care_giver_id, hidden: false })
            .populate<DP>('procedures')

    res.status(200).send({
        message: 'Doctors fetched successfully',
        success: true,
        data: {
            doctors
        }
    })
}

const getDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const doctor_id = req.query.doctor_id

    type PopulatedCareGiver = WithPopulated<IDoctorDoc, 'care_giver', ICareGiverDoc>
    type DCP = WithPopulated<PopulatedCareGiver, 'procedures', IDoctorWithProcedures>
    const doctor: DCP | null = await Doctor.findOne({
        _id: doctor_id,
        hidden: false
    }).populate<DCP>('care_giver procedures')

    if (!doctor) {
        return next(new NotFoundError('Doctor not found'))
    }

    res.status(200).send({
        message: 'Doctor fetched successfully',
        success: true,
        data: {
            doctor
        }
    })
}

const updateDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const doctor_id = req.query.doctor_id

    const {
        firstname, lastname,
        phone_number, experience,
        medical_unit, biography,
    } = req.body

    type ExcludedFields = 'care_giver' | 'number_of_patients' | 'hidden' | 'procedures' | 'gender'
    type UpdateableFields = {
        [K in Exclude<keyof IDoctor, ExcludedFields>]: IDoctor[K]
    }
    const doctor_data: UpdateableFields = {
        firstname, lastname,
        phone_number, experience,
        medical_unit, biography,
    }

    const doctor: IDoctor | null = await Doctor.findByIdAndUpdate(doctor_id, doctor_data, { new: true })

    if (!doctor) {
        return next(new NotFoundError('Doctor not found'))
    }

    res.status(200).send({
        message: 'Doctor updated successfully',
        success: true,
        data: {
            doctor
        }
    })
}

const addProcedureToDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const doctor_id = req.query.doctor_id
    const procedure_id = req.query.procedure_id

    type DCP = IDoctorWithProceduresAndClinic
    const doctor: IDoctorDoc | null =
        await Doctor
            .findByIdAndUpdate(
                doctor_id,
                {
                    $addToSet: {
                        procedures: procedure_id
                    }
                }, { new: true })
            .populate<DCP>('procedures care_giver')

    if (!doctor) {
        return next(new NotFoundError('Doctor not found'))
    }

    res.status(200).send({
        message: 'Procedure added successfully',
        success: true,
        data: {
            doctor
        }
    })
}

const removeProcedureFromDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const doctor_id = req.query.doctor_id
    const procedure_id = req.query.procedure_id

    type DCP = IDoctorWithProceduresAndClinic
    const doctor: IDoctorDoc | null =
        await Doctor
            .findByIdAndUpdate(
                doctor_id,
                {
                    $pull: {
                        procedures: procedure_id
                    }
                }, { new: true })
            .populate<DCP>('procedures care_giver')

    if (!doctor) {
        return next(new NotFoundError('Doctor not found'))
    }

    res.status(200).send({
        message: 'Procedure removed successfully',
        success: true,
        data: {
            doctor
        }
    })
}

const deleteDoctorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const doctor_id = req.query.doctor_id

    const doctor: IDoctorDoc | null = await Doctor.findByIdAndUpdate(doctor_id, { hidden: true }, { new: true })

    if (!doctor) {
        return next(new NotFoundError('Doctor not found'))
    }

    res.status(200).send({
        message: 'Doctor deleted successfully',
        success: true,
        data: {
            doctor
        }
    })
}


export {
    createDoctorProfile,
    getDoctorsProfiles,
    getDoctorProfile,
    updateDoctorProfile,
    deleteDoctorProfile,
    addProcedureToDoctorProfile,
    removeProcedureFromDoctorProfile
}