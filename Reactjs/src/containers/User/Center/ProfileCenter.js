import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileCenter.scss'
import { getProfileCenterById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format'
import _ from 'lodash';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

class ProfileCenter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {},
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.centerId)
        this.setState({
            dataProfile: data
        })
    }

    getInforDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileCenterById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }

        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.centerId !== prevProps.centerId) {
            // this.getInforDoctor(this.props.centerId)
        }
    }

    rednerTimeBooking = (dataTime) => {
        let { language } = this.props


        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            return (
                <>
                    <div className=''>{date} - {time}</div>
                    <div className=''>
                        <FormattedMessage id='user.booking-modal.priceBooking' />
                    </div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state
        let { language, isShowDesDoctor, dataTime } = this.props
        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.provinceTypeData) {
            nameVi = `${dataProfile.Center_Infor.provinceTypeData.valueVi}`
            nameEn = `${dataProfile.Center_Infor.provinceTypeData.valueEn} `
        }
        console.log('check state modal: ', this.state)
        return (
            <div className='profile-doctor-container'>
                <div className='intro-center'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    ></div>
                    <div className='content-right'>
                        <div className='up'>
                            <div className='name'>
                                {dataProfile.fullName}
                            </div>
                            <div className='province'>
                                <i><FontAwesomeIcon icon={faMapMarkedAlt} /></i>
                                {dataProfile.address}
                            </div>
                        </div>
                        <div className='down'>
                            {isShowDesDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description
                                        && <span>
                                            {dataProfile.Markdown.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.rednerTimeBooking(dataTime)}
                                </>
                            }
                        </div>

                    </div>
                </div>
                <div className='price'>
                    <FormattedMessage id='user.extra-infor.price' />
                    {
                        dataProfile && dataProfile.Center_Infor && language === LANGUAGES.VI &&
                        <NumberFormat
                            value={dataProfile.Center_Infor.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                            className='currency'
                        />
                    }
                    {
                        dataProfile && dataProfile.Center_Infor && language === LANGUAGES.EN &&
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Center_Infor.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'$'}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCenter);
