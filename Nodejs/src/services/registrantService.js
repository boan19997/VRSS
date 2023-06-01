import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (centerId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&centerId=${centerId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.centerId || !data.timeType || !data.date
                || !data.fullName || !data.address || !data.selectedGender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {

                let token = uuidv4() //sinh ra mã token để verify

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    centerName: data.centerName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.centerId, token)
                })

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        gender: data.selectedGender,
                        fullName: data.fullName
                    },
                })

                //create a booking 
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { userId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            centerId: data.centerId,
                            userId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            reason: data.reason,
                            imgCar: data.imgCar
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.centerId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        centerId: data.centerId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been actived or does not exist'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment, postVerifyBookAppointment
}