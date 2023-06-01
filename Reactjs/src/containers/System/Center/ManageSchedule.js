import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import * as actions from '../../../store/actions'
import { LANGUAGES, dateFormat } from '../../../utils';
//import để sử dụng chọn ngày tháng
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment'; //sử dụng để format ngày tháng
import { toast } from 'react-toastify'
import _ from 'lodash';
import { saveBulkScheduleCenter } from '../../../services/userService'

class ManageSchedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            listCenters: [],
            selectedCenter: {},
            currentDate: '',
            rangeTime: [],
        }

    }

    componentDidMount() {
        this.props.fecthAllCenter()
        this.props.fecthAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelected = this.buildDataSelect(this.props.allDoctors)
            this.setState({
                listCenters: dataSelected
            })
        }

        if (prevProps.allTime !== this.props.allTime) {
            let data = this.props.allTime
            if (data && data.length > 0) {
                data.map(item => {
                    item.isSelected = false
                    return item
                })
            }
            this.setState({
                rangeTime: data
            })
        }
    }


    buildDataSelect = (data) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            data.map((item, index) => {
                let object = {}
                let labelVi = `${item.fullName}`
                let labelEn = `${item.fullName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id;
                result.push(object)
            })
        }
        return result
    }


    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedCenter: selectedOption })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleBtnTime = (time) => {
        let { rangeTime } = this.state
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected
                return item
            })

            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedCenter, currentDate } = this.state
        let result = []
        if (!currentDate) {
            toast.error("Invalid date!")
            return
        }
        if (selectedCenter && _.isEmpty(selectedCenter)) {
            toast.error("Invalid seclected doctor!")
            return
        }

        let formattedDate = new Date(currentDate).getTime()

        if (rangeTime && rangeTime.length > 0) {
            let seclectedTime = rangeTime.filter(item => item.isSelected === true)
            if (seclectedTime && seclectedTime.length > 0) {
                seclectedTime.map(schedule => {
                    let object = {}
                    object.centerId = selectedCenter.value
                    object.date = formattedDate
                    object.timeType = schedule.keyMap
                    result.push(object)
                })
            } else {
                toast.error("Invalid selected time!")
                return
            }
        }
        let res = await saveBulkScheduleCenter({
            arrSchedule: result,
            centerId: selectedCenter.value,
            formattedDate: '' + formattedDate
        })

        if (res && res.errCode === 0) {
            toast.success("Save infor success!")
        } else {
            toast.error("error save infor!")
        }
    }




    render() {
        let { rangeTime } = this.state
        let { language } = this.props
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        console.log('check state schedule: ', this.state)
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label className='choose'>
                                <FormattedMessage id="manage-schedule.chose-center" />
                            </label>
                            <Select
                                value={this.state.selectedCenter}
                                onChange={this.handleChangeSelect}
                                options={this.state.listCenters}
                            />

                        </div>
                        <div className='col-6 form-group'>
                            <label className='choose'>
                                <FormattedMessage id="manage-schedule.chose-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday} //giới hạn (ko cho đặt quá khứ)
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                            key={index}
                                            onClick={() => this.handleBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save-info" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allTime: state.admin.allTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fecthAllCenter: () => dispatch(actions.fecthAllCenter()),
        fecthAllScheduleTime: () => dispatch(actions.fecthAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
