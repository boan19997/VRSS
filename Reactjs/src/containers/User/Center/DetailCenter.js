import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailCenter.scss'
import { getDetailInforCenter } from '../../../services/userService' //viết trực tiếp API
import { LANGUAGES } from '../../../utils';
import CenterSchedule from './CenterSchedule';
import CenterExtraInfor from './CenterExtraInfor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

class DetailCenter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            detailCenter: {},
            currentCenterId: -1,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            this.setState({
                currentCenterId: id
            })

            let res = await getDetailInforCenter(id)
            if (res && res.errCode === 0) {
                this.setState({
                    detailCenter: res.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        console.log('check state detail: ', this.state.detailCenter)
        let { detailCenter } = this.state
        let { language } = this.props
        let nameVi = '', nameEn = ''
        if (detailCenter && detailCenter.provinceTypeData) {
            nameVi = `${detailCenter.Center_Infor.provinceTypeData.valueVi}`
            nameEn = `${detailCenter.Center_Infor.provinceTypeData.valueEn}`
        }
        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-center'>
                        <div
                            className='content-left'
                            style={{ backgroundImage: `url(${detailCenter && detailCenter.image ? detailCenter.image : ''})` }}
                        ></div>
                        <div className='content-right'>
                            <div className='up'>
                                <div className='name'>
                                    {detailCenter.fullName}
                                </div>
                                <div className='province'>
                                    <i><FontAwesomeIcon icon={faMapMarkedAlt} /></i>
                                    {detailCenter.address}
                                </div>
                            </div>
                            <div className='down'>
                                {detailCenter && detailCenter.Markdown && detailCenter.Markdown.description
                                    && <span>
                                        {detailCenter.Markdown.description}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-center'>
                        <div className='content-left'>
                            <CenterSchedule
                                centerIdFromParent={this.state.currentCenterId}
                            />
                        </div>
                        <div className='content-right'>
                            <CenterExtraInfor
                                centerIdFromParent={this.state.currentCenterId}
                                detailFromParent={this.state.detailCenter}
                            />
                        </div>
                    </div>
                    <div className='detail-infor-center'>
                        {detailCenter && detailCenter.Markdown && detailCenter.Markdown.contentHTML
                            && <div dangerouslySetInnerHTML={{ __html: detailCenter.Markdown.contentHTML }}></div>
                        }
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailCenter);
