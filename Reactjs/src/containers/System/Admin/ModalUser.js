import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { LANGUAGES, CommonUtils } from '../../../utils';
import './ModalUser.scss'

class ModalUser extends Component {

    constructor(props) {
        super(props)
        this.state = {

            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,

            //value user
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
        }
    }

    componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        //position
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
        //role
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux
            let arrPositions = this.props.positionRedux
            let arrRoles = this.props.roleRedux

            this.setState({
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                previewImgUrl: '',
            })
        }

    }

    toggle = () => {
        this.props.toggleUserModal()
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }

        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ['email', 'password', 'fullName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false
                alert('This input is required: ' + arrCheck[i])
                break
            }
        }

        return isValid
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            //fire redux create user
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                fullName: this.state.fullName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                avatar: this.state.avatar,
            })
            this.toggle()

            this.setState({
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                address: '',
                gender: '',
                position: '',
                role: '',
            })
        }
    }

    openPreviewImg = () => {
        if (!this.state.previewImgUrl) return
        this.setState({
            isOpen: true
        })
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

    render() {
        let roles = this.state.roleArr
        let language = this.props.language

        let { email, password, fullName, phoneNumber, address, role } = this.state
        console.log('check state creat user: ', this.state)
        return (
            <Modal
                isOpen={this.props.isOpenModalUser}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id="manage-user.title-modal.tile-add" />
                </ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.email" /></label>
                            <input className='form-control' type='email'
                                value={email}
                                onChange={(event) => { this.onChangeInput(event, 'email') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.password" /></label>
                            <input className='form-control' type='password'
                                value={password}
                                onChange={(event) => { this.onChangeInput(event, 'password') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.full-name" /></label>
                            <input className='form-control' type='text'
                                value={fullName}
                                onChange={(event) => { this.onChangeInput(event, 'fullName') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.address" /></label>
                            <input className='form-control' type='text'
                                value={address}
                                onChange={(event) => { this.onChangeInput(event, 'address') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.phone-number" /></label>
                            <input className='form-control' type='text'
                                value={phoneNumber}
                                onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.role" /></label>
                            <select id="inputState" className="form-control"
                                onChange={(event) => { this.onChangeInput(event, 'role') }}
                                value={role}
                            >
                                {roles && roles.length > 0 &&
                                    roles.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='input-container col-12'>
                            <label><FormattedMessage id="manage-user.image" /></label>
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
                        {this.state.isOpen === true &&
                            <Lightbox
                                mainSrc={this.state.previewImgUrl}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                            />

                        }

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='btn btn-success px-3' onClick={() => { this.handleSaveUser() }}>
                        <FormattedMessage id="manage-user.title-modal.add-new" />
                    </Button>
                    <Button className='btn btn-danger px-3' onClick={() => { this.toggle() }}>
                        <FormattedMessage id="manage-user.title-modal.close" />
                    </Button>
                </ModalFooter>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoading,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),

        //position
        getPositionStart: () => dispatch(actions.fetchPositionStart()),

        //role
        getRoleStart: () => dispatch(actions.fetchRoleStart()),

        //create
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
