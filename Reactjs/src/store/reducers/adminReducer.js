import actionTypes from '../actions/actionTypes';

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null,
}

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoadingGender: false,
    users: [],
    topDoctors: [],
    allDoctors: [],
    allTime: [],

    allRequiredDoctorInfor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data
            state.isLoadingGender = false
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false
            state.genders = []
            return {
                ...state
            }

        //position
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = []
            return {
                ...state
            }

        //role

        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = []
            return {
                ...state
            }
        //all user
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.users
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users = []
            return {
                ...state
            }
        //top doctor
        case actionTypes.FETCH_TOP_CENTER_SUCCESS:
            state.topDoctors = action.dataDoctors
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_CENTER_FAILED:
            state.topDoctors = []
            return {
                ...state
            }
        //all doctor
        case actionTypes.FETCH_ALL_CENTER_SUCCESS:
            state.allDoctors = action.dataAllDoctors
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CENTER_FAILED:
            state.allDoctors = []
            return {
                ...state
            }
        //get time schedule
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIMES_SUCCESS:
            state.allTime = action.dataTime
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIMES_FAILED:
            state.allTime = []
            return {
                ...state
            }
        //doctor infor
        case actionTypes.FETCH_REQUIRED_CENTER_INFOR_SUCCESS:
            state.allRequiredDoctorInfor = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_CENTER_INFOR_FAILED:
            state.allRequiredDoctorInfor = []
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;