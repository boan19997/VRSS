import actionTypes from './actionTypes';
import {
    createNewUserService, getAllCodeService, getAllUser,
    deleteUserService, editUserService, getToCenterHomeService,
    getAllCenterService, saveDetailCenterService,
} from '../../services/userService';
import { toast } from 'react-toastify';

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService("POSITION")
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            } else {
                dispatch(fetchPositionFailed())
            }
        } catch (e) {
            dispatch(fetchPositionFailed())
            console.log('fetchPositionStart error', e)
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService("ROLE")
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            } else {
                dispatch(fetchRoleFailed())
            }
        } catch (e) {
            dispatch(fetchRoleFailed())
            console.log('fetchRoleFailed error', e)
        }
    }
}
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })

            let res = await getAllCodeService("GENDER")
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed())
            }
        } catch (e) {
            dispatch(fetchGenderFailed())
            console.log('fetchGenderStart error', e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await createNewUserService(data)
            console.log('check create UserRedux: ', res)
            if (res && res.errCode === 0) {
                toast.success("Create a new user succeed!")
                dispatch(createUserSuccess())
                dispatch(fecthAllUserStart())
            } else {
                toast.error("Create user error!")
                dispatch(createUserFailed())
            }
        } catch (e) {
            toast.error("Create user error!")
            dispatch(createUserFailed())
            console.log('createUserFailed error', e)
        }
    }
}

export const createUserSuccess = () => (
    {
        type: actionTypes.CREATE_USER_SUCCESS
    }
)

export const createUserFailed = () => ({
    type: actionTypes.CREATE_USER_FALIED
})

export const fecthAllUserStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllUser("ALL")
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()))
            } else {
                toast.error("Fetch user error!")
                dispatch(fetchAllUserFailed())
            }
        } catch (e) {
            toast.error("Fetch user error!")
            dispatch(fetchAllUserFailed())
            console.log('fetchAllUserFailed error', e)
        }
    }
}

export const fetchAllUserSuccess = (data) => (
    {
        type: actionTypes.FETCH_ALL_USER_SUCCESS,
        users: data
    }
)

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {

            let res = await deleteUserService(userId)
            if (res && res.errCode === 0) {
                toast.success("Delete user succeed!")
                dispatch(deleteUserSuccess())
                dispatch(fecthAllUserStart())
            } else {
                toast.error("Delete user error!")
                dispatch(deleteUserFailed())
            }
        } catch (e) {
            toast.error("Delete user error!")
            dispatch(deleteUserFailed())
            console.log('deleteUserFailed error', e)
        }
    }
}

export const deleteUserSuccess = () => (
    {
        type: actionTypes.DELETE_USER_SUCCESS
    }
)

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FALIED
})

export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await editUserService(data)
            if (res && res.errCode === 0) {
                toast.success("Update user succeed!")
                dispatch(editUserSuccess())
                dispatch(fecthAllUserStart())
            } else {
                toast.error("Update user error!")
                dispatch(editUserFailed())
            }
        } catch (e) {
            toast.error("Update user error!")
            dispatch(editUserFailed())
            console.log('editUserFailed error', e)
        }
    }
}

export const editUserSuccess = () => (
    {
        type: actionTypes.EDIT_USER_SUCCESS
    }
)

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FALIED
})

export const fecthTopCenter = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getToCenterHomeService('')
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_CENTER_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_CENTER_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_CENTER_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_TOP_CENTER_FAILED
            })
        }
    }
}

export const fecthAllCenter = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCenterService()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_CENTER_SUCCESS,
                    dataAllDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_CENTER_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_CENTER_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALL_CENTER_FAILED
            })
        }
    }
}
export const saveDetailCenter = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailCenterService(data)
            if (res && res.errCode === 0) {
                toast.success("Save detail center succeed!")
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_CENTER_SUCCESS,
                })
            } else {
                toast.error("Save detail center error!")
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_CENTER_FAILED
                })
            }
        } catch (e) {
            toast.error("Save detail center error!")
            console.log('FETCH_SAVE_DETAIL_CENTER_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_SAVE_DETAIL_CENTER_FAILED
            })
        }
    }
}
export const fecthAllScheduleTime = (type) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME")
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIMES_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIMES_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIMES_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIMES_FAILED
            })
        }
    }
}

//get tất cả những thông tin mà doctor yêu cầu
export const getRequiedCenterInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_START })

            let resPrice = await getAllCodeService("PRICE")
            let resPayment = await getAllCodeService("PAYMENT")
            let resProvince = await getAllCodeService("PROVINCE")
            if (resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data
                }

                dispatch(fetchRequiredCenterInforSuccess(data))
            } else {
                dispatch(fetchRequiredCenterInforFailed())
            }
        } catch (e) {
            dispatch(fetchRequiredCenterInforFailed())
            console.log('fetchRequiredCenterInfor error', e)
        }
    }
}

export const fetchRequiredCenterInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_SUCCESS,
    data: allRequiredData
})
export const fetchRequiredCenterInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_CENTER_INFOR_FAILED
})