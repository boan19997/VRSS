import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer'>
                <p>&copy; <FormattedMessage id="footer.copy-right" />
                    <a target='_blank' href='https://www.facebook.com/profile.php?id=100011778605728'><FormattedMessage id="footer.click-here" /></a>
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
