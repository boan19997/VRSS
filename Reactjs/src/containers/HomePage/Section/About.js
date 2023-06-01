import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {

        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Nguyễn Đạt nói gì ?
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/nH1TQRHnBbc"
                            title="Cục Đăng Kiểm Chỉ Đạo Nóng Vụ Các Trung Tâm Đăng Kiểm Chỉ Nhận Xe Chính Chủ | SKĐS"
                            border="0"
                            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" >

                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>Cục Đăng Kiểm Chỉ Đạo Nóng Vụ Các Trung Tâm Đăng Kiểm Chỉ Nhận Xe Chính Chủ | SKĐS</p>
                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

//const này có tác dụng là thay cho this.props để redux map đc với react
const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
