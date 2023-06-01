import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils'
import { withRouter } from 'react-router'

//thư viện làm cái chuyển động 
import Slider from "react-slick";

class Center extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctor: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctor()
    }

    handleViewDetailCenter = (doctor) => {
        // thêm điều kiện để ko chết 
        if (this.props.history) {
            this.props.history.push(`/detail-center/${doctor.id}`)
        }
    }

    render() {
        let arrDoctor = this.state.arrDoctor
        let { language } = this.props
        console.log('check arrDoctors: ', arrDoctor)
        return (
            <div className='section-share section-outstanding-center'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.section-center" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info" /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctor && arrDoctor.length > 0
                                && arrDoctor.map((item, index) => {
                                    //mã hoá lại ảnh
                                    let imageBase64 = ''
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary')
                                    }
                                    //thay đổi ngôn ngữ
                                    let nameVi = `${item.Center_Infor.provinceTypeData.valueVi}`
                                    let nameEn = `${item.Center_Infor.provinceTypeData.valueEn} `
                                    return (
                                        <div
                                            className='section-customize'
                                            key={index}
                                            onClick={() => this.handleViewDetailCenter(item)}
                                        >
                                            <div className='bg-img section-outstanding-center'
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                            />
                                            <div className='position text-center section-text'>
                                                <div className='name'>{item.fullName}</div>
                                                <div className='province'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctor: () => dispatch(actions.fecthTopCenter())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Center));
