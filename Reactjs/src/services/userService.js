import axios from "../axios"

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}

const getAllUser = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, data)
}

const deleteUserService = (userId) => {
    // return axios.delete(`/api/delete-user`, { id: userId })
    return axios.delete(`/api/delete-user`, {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) => {
    return axios.put(`/api/edit-user`, inputData)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getToCenterHomeService = (limit) => {
    return axios.get(`/api/top-center-home?limit=${limit}`)
}

const getAllCenterService = () => {
    return axios.get(`/api/get-all-centers`)
}

const saveDetailCenterService = (data) => {
    return axios.post('/api/save-infor-centers', data)
}

const getDetailInforCenter = (inputId) => {
    return axios.get(`/api/get-detail-center-by-id?id=${inputId}`)
}

const saveBulkScheduleCenter = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getScheduleByDate = (centerId, date) => {
    //để nối chuỗi req.query thì sử dụng dấu &
    return axios.get(`/api/get-schedule-center-by-date?centerId=${centerId}&date=${date}`)
}

const getExtraInforCenterById = (centerId) => {
    return axios.get(`/api/get-extra-infor-center-by-id?centerId=${centerId}`)
}

const getProfileCenterById = (centerId) => {
    return axios.get(`/api/get-profile-center-id?centerId=${centerId}`)
}

const postUserBookingAppointment = (data) => {
    return axios.post('/api/user-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const getAllUserForCenter = (data) => {
    return axios.get(`/api/get-list-user-for-center?centerId=${data.centerId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

const postSendRefuse = (data) => {
    return axios.post('/api/send-refuse', data)
}

export {
    handleLoginApi, getAllUser, createNewUserService,
    deleteUserService, editUserService, getAllCodeService,
    getToCenterHomeService, getAllCenterService,
    saveDetailCenterService, getDetailInforCenter, saveBulkScheduleCenter,
    getScheduleByDate, getExtraInforCenterById, getProfileCenterById,
    postUserBookingAppointment, postVerifyBookAppointment,
    getAllUserForCenter, postSendRemedy, postSendRefuse

}