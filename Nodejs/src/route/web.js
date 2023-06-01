import express from "express";
import userController from '../controllers/userController'
import centerController from '../controllers/centerController';
import registrantController from '../controllers/registrantController'

let router = express.Router();

let initWWebRouters = (app) => {

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCreateNewUsers)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllcode)

    router.get('/api/top-center-home', centerController.getTopCenterHome)

    router.get('/api/get-all-centers', centerController.getAllCenters)
    router.post('/api/save-infor-centers', centerController.postInforDoctor)
    router.get('/api/get-detail-center-by-id', centerController.getDetailDoctor)
    router.post('/api/bulk-create-schedule', centerController.bulkCreateSchedule)
    router.get('/api/get-schedule-center-by-date', centerController.getScheduleDoctorByDate)
    router.post('/api/send-remedy', centerController.sendRemedy)
    router.post('/api/send-refuse', centerController.sendRefuse)

    router.get('/api/get-extra-infor-center-by-id', centerController.getExtraInforCenterById)

    router.get('/api/get-profile-center-id', centerController.getProfileCenterById)
    router.get('/api/get-list-user-for-center', centerController.getListUserForCenter)

    router.post('/api/user-book-appointment', registrantController.postBookAppointment)
    router.post('/api/verify-book-appointment', registrantController.postVerifyBookAppointment)


    return app.use("/", router);
}

module.exports = initWWebRouters;