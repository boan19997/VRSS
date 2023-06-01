import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RefuseModal.scss'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'
import { toast } from 'react-toastify';
import moment from 'moment'
import { CommonUtils } from '../../../utils';

class RefuseModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            refuse: '',
        }
    }

    componentDidMount() {
        if (this.props.dataModalRefuse) {
            this.setState({
                email: this.props.dataModalRefuse.email
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModalRefuse !== this.props.dataModalRefuse) {
            this.setState({
                email: this.props.dataModalRefuse.email
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeInput = async (event) => {
        let valueInput = event.target.value
        this.setState({
            refuse: valueInput
        })
    }

    handleSendRefuse = () => {
        //sendrefuse
        this.props.sendRefuse(this.state)
    }

    render() {
        let { isOpenModalRefuse, closeRefuseModal, dataModalRefuse, sendRefuse } = this.props
        console.log('check props refuseModal: ', this.props)
        return (
            <Modal
                isOpen={isOpenModalRefuse}
                className={'booking-modal-container'}
                size='md'
                centered
            // backdrop={true}
            >
                <div className="modal-header">
                    <h5 className="modal-title">
                        <FormattedMessage id='remedy.title' />
                    </h5>
                    <button type="button" className="close" aria-label="Close" onClick={closeRefuseModal}>
                        <span aria-hidden="true">
                            ×
                        </span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>
                                <FormattedMessage id='remedy.email' />
                            </label>
                            <input className='form-control' type="email" value={this.state.email}
                                onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>
                                <FormattedMessage id='remedy.file' />
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                value={this.state.refuse}
                                onChange={(event) => this.handleOnChangeInput(event, 'refuse')}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendRefuse()}>Send</Button>{' '}
                    <Button color="secondary" onClick={closeRefuseModal}>Cancel</Button>
                </ModalFooter>
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

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RefuseModal);
