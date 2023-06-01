import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Modal } from 'reactstrap'
import ProfileCenter from '../ProfileCenter';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker'
import * as actions from '../../../../store/actions'
import { CommonUtils, LANGUAGES } from '../../../../utils';
import Select from 'react-select'
import { postUserBookingAppointment } from '../../../../services/userService'
import { toast } from 'react-toastify';
import moment from 'moment'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import LoadingOverlay from 'react-loading-overlay'


class BookingModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: null,
            centerId: '',
            timeType: '',
            previewImgUrl: '',
            avatar: '',
            isOpen: false,
            isShowLoading: false,

            genders: '',
        }
    }

    componentDidMount() {
        this.props.getGenders()
    }

    buildDataGender = (data) => {
        let result = []
        let language = this.props.language

        if (data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let centerId = this.props.dataTime.centerId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    centerId: centerId,
                    timeType: timeType,
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value
        let stateCopy = { ...this.state }
        stateCopy[id] = valueInput
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelected = (selectedOption) => {
        this.setState({ selectedGender: selectedOption })
    }

    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        })
        //validate input 
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let centerName = this.buildDoctorName(this.props.dataTime)
        let res = await postUserBookingAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            centerId: this.state.centerId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            centerName: centerName,
            imgCar: this.state.avatar
        })

        if (res && res.errCode === 0) {
            isShowLoading: false
            toast.success('Booking a new appointment successed!')
            this.props.closeBookingModal()
        } else {
            isShowLoading: false
            toast.error('Booking a new appointment error!')
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.fullName}`
                :
                `${dataTime.doctorData.fullName}`

            return name
        }
        return ''
    }

    handleOnChangeImg = async (event) => {
        let data = event.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImg = () => {
        if (!this.state.previewImgUrl) return
        this.setState({
            isOpen: true
        })
    }


    render() {

        let { isOpenModal, closeBookingModal, dataTime } = this.props
        let centerId = ''
        console.log('check state booking: ', this.state)
        if (dataTime && !_.isEmpty(dataTime)) {
            centerId = dataTime.centerId
        }

        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size='lg'
                centered
            // backdrop={true}
            >
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>
                                <FormattedMessage id='user.booking-modal.title' />
                            </span>
                            <span
                                className='right'
                                onClick={closeBookingModal}
                            >
                                <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-infor'>
                                <ProfileCenter
                                    centerId={centerId}
                                    isShowDesDoctor={false}
                                    dataTime={dataTime}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.fullName' />
                                    </label>
                                    <input
                                        className='form-control'
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.phoneNumber' />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.email' />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.address' />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.reason' />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.birthday' />
                                    </label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.birthday}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id='user.booking-modal.gender' />
                                    </label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelected}
                                        options={this.state.genders}
                                    />
                                </div>
                                <div className='col-12 '>
                                    <label>Ảnh xe</label>
                                    <div className='preview-img-container'>
                                        <input id='prewImg' type='file' hidden
                                            onChange={(event) => this.handleOnChangeImg(event)}
                                        />
                                        <label className='label-upload' htmlFor='prewImg'>Tải ảnh <i className='fas fa-upload'></i></label>
                                        <div className='preview-image'
                                            style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                            onClick={() => this.openPreviewImg()}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button
                                className='btn btn-success'
                                onClick={() => this.handleConfirmBooking()}
                            >
                                <FormattedMessage id='user.booking-modal.btn-confirm' />
                            </button>
                            <button className='btn btn-danger'
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id='user.booking-modal.btn-cancel' />
                            </button>
                        </div>
                    </div>
                </LoadingOverlay>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    >

                    </Lightbox>

                }
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
