import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageUser.scss'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllUserForCenter, postSendRemedy, postSendRefuse } from '../../../services/userService'
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import RefuseModal from './RefuseModal ';

class ManageUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataUser: [],
            isOpenRemedyModal: false,
            isOpenRefuseModal: false,
            dataModal: {},
            dataModalRefuse: {},
            isShowLoading: false,
            isOpen: false,
            previewImg: '',
        }
    }

    async componentDidMount() {
        this.getDataUser()
    }

    getDataUser = async () => {
        let { user } = this.props
        let { currentDate } = this.state
        let formatedDate = new Date(currentDate).getTime()
        let res = await getAllUserForCenter({
            centerId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataUser: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataUser()
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            centerId: item.centerId,
            userId: item.userId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.fullName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    handleBtnRefuse = (item) => {
        let data = {
            centerId: item.centerId,
            userId: item.userId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.fullName
        }
        this.setState({
            isOpenRefuseModal: true,
            dataModalRefuse: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    closeRefuseModal = () => {
        this.setState({
            isOpenRefuseModal: false,
            dataModalRefuse: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            centerId: dataModal.centerId,
            userId: dataModal.userId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName

        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send remedy success!')
            this.closeRemedyModal()
            await this.getDataUser()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrongs....')
        }
    }

    sendRefuse = async (dataChild) => {
        let { dataModalRefuse } = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRefuse({
            email: dataChild.email,
            refuse: dataChild.refuse,
            centerId: dataModalRefuse.centerId,
            userId: dataModalRefuse.userId,
            timeType: dataModalRefuse.timeType,
            language: this.props.language,
            patientName: dataModalRefuse.patientName

        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send remedy success!')
            this.closeRefuseModal()
            await this.getDataUser()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrongs....')
        }
    }

    openPreviewImg = () => {
        let previewImg = this.state.dataUser[0].imgCar
        if (!previewImg)
            return
        this.setState({
            isOpen: true,
            previewImg: previewImg
        })
    }

    render() {
        console.log('check manage user: ', this.state)
        let { dataUser, isOpenRemedyModal, isOpenRefuseModal, dataModal, dataModalRefuse, previewImg } = this.state
        let { language } = this.props
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            <FormattedMessage id="manage-registrant.title" />
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label className='choose'>
                                    <FormattedMessage id="manage-registrant.choose" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12'>
                                <table id='TableManageUser'>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Dòng xe, biển số</th>
                                            <th>Ảnh xe</th>
                                            <th>Action</th>
                                        </tr>
                                        {dataUser && dataUser.length > 0 ?
                                            dataUser.map((item, index) => {
                                                let time = language === LANGUAGES.VI ?
                                                    item.timeTypeDataPatient.valueVi
                                                    :
                                                    item.timeTypeDataPatient.valueEn

                                                let gender = language === LANGUAGES.VI ?
                                                    item.patientData.genderData.valueVi
                                                    :
                                                    item.patientData.genderData.valueEn

                                                let imageBase64 = ''
                                                if (item.imgCar) {
                                                    imageBase64 = new Buffer(item.imgCar, 'base64').toString('binary')
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.fullName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>{item.reason}</td>
                                                        <td className='d-flex justify-content-center'>

                                                            <div className='bg-img-car'
                                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                                                onClick={() => this.openPreviewImg()}
                                                            ></div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className='confirm'
                                                                onClick={() => this.handleBtnConfirm(item)}
                                                            >
                                                                Xác nhận
                                                            </button>
                                                            <button
                                                                className='refuse'
                                                                onClick={() => this.handleBtnRefuse(item)}
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : <tr>
                                                <td colSpan='8'>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {this.state.isOpen === true &&

                            <Lightbox
                                mainSrc={previewImg}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                            />

                        }
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                    <RefuseModal
                        isOpenModalRefuse={isOpenRefuseModal}
                        dataModalRefuse={dataModalRefuse}
                        closeRefuseModal={this.closeRefuseModal}
                        sendRefuse={this.sendRefuse}
                    />
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
