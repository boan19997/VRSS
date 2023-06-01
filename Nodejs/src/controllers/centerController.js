import centerService from '../services/centerService'

let getTopCenterHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10
    try {
        let response = await centerService.getTopCenterHome(+limit)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        })
    }
}

let getAllCenters = async (req, res) => {
    try {
        let doctors = await centerService.getAllCenters()
        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await centerService.saveDetailInforCenter(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let infor = await centerService.getDetailCenterById(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await centerService.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        //req.query.doctor chính là lấy tham số trên thanh địa chỉ (?id=)
        //req.query chính là lấy các tham số trên HTML đó
        let infor = await centerService.getScheduleByDate(req.query.centerId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let getExtraInforCenterById = async (req, res) => {
    try {
        let infor = await centerService.getExtraInforCenterById(req.query.centerId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let getProfileCenterById = async (req, res) => {
    try {
        let infor = await centerService.getProfileCenterById(req.query.centerId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let getListUserForCenter = async (req, res) => {
    try {
        let infor = await centerService.getListUserForCenter(req.query.centerId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let infor = await centerService.sendRemedy(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let sendRefuse = async (req, res) => {
    try {
        let infor = await centerService.sendRefuse(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    getTopCenterHome: getTopCenterHome,
    getAllCenters: getAllCenters,
    postInforDoctor: postInforDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule, getScheduleDoctorByDate, getExtraInforCenterById,
    getProfileCenterById, getListUserForCenter, sendRemedy, sendRefuse
}