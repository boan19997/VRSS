import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopCenterHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Center_Infor,
                        attributes: {
                            exclude: ['id', 'centerId']
                        },
                        include: [
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCenters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors,
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforCenter = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.centerId || !inputData.contentHTML || !inputData.contentMarkdown ||
                !inputData.action || !inputData.selectedPrice || !inputData.selectedPayment ||
                !inputData.selectedProvince || !inputData.note
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter'
                })
            } else {

                //upsert bảng markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        centerId: inputData.centerId,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { centerId: inputData.centerId },
                        raw: false,
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save()
                    }
                }

                //upsert bảng doctor_infor
                let doctorInfor = await db.Center_Infor.findOne({
                    where: {
                        centerId: inputData.centerId,
                    },
                    raw: false
                })

                if (doctorInfor) {
                    //update
                    doctorInfor.centerId = inputData.centerId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.note = inputData.note;
                    await doctorInfor.save()
                } else {
                    //create
                    await db.Center_Infor.create({
                        centerId: inputData.centerId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        note: inputData.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor success!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailCenterById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Center_Infor,
                            attributes: {
                                exclude: ['id', 'centerId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.centerId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // console.log('check data send: ', schedule)

                let existing = await db.Schedule.findAll(
                    {
                        where: { centerId: data.centerId, date: data.formattedDate },
                        attributes: ['timeType', 'date', 'centerId', 'maxNumber'],
                        raw: true
                    }
                )

                //đây là bước covert nếu đã giống nhau thì ko càn bước này
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime()
                //         return item
                //     })
                // }

                //code này để check xem đã có data chưa
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date //thêm dấu cộng phía trc để cover sang Number
                })

                //console ra cái khác với cái cũ và kiểm tra 
                // console.log('check different: ', toCreate)

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (centerId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!centerId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        centerId: centerId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },

                        { model: db.User, as: 'doctorData', attributes: ['fullName'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = []

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforCenterById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Center_Infor.findOne({
                    where: {
                        centerId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'centerId']
                    },
                    include: [

                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileCenterById = (centerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!centerId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: centerId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Center_Infor,
                            attributes: {
                                exclude: ['id', 'centerId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListUserForCenter = (centerId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!centerId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        centerId: centerId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData', attributes: ['email', 'fullName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.centerId || !data.userId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                //updat status
                let appointment = await db.Booking.findOne({
                    where: {
                        centerId: data.centerId,
                        userId: data.userId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                //send email
                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let sendRefuse = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.centerId || !data.userId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                //updat status
                let appointment = await db.Booking.findOne({
                    where: {
                        centerId: data.centerId,
                        userId: data.userId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                //send email
                await emailService.sendRefuse(data)

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    saveDetailInforCenter: saveDetailInforCenter,
    getDetailCenterById: getDetailCenterById, bulkCreateSchedule,
    getScheduleByDate, getExtraInforCenterById, getProfileCenterById,
    getListUserForCenter, sendRemedy, sendRefuse
}