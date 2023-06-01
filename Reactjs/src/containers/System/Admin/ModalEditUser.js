import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import * as actions from '../../../store/actions'
import { LANGUAGES, CommonUtils } from '../../../utils';
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import _ from 'lodash';

class ModalEditUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            previewImgUrl: '',
            genderArr: [],
            positionArr: [],
            roleArr: [],
        }
    }

    async componentDidMount() {
        this.props.getGenderStart() //cách viết 1 
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

        if (this.props.currentUser !== prevProps.currentUser) {
            let user = this.props.currentUser
            let imageBase64 = ''
            if (user.image) {
                imageBase64 = new Buffer(user.image, 'base64').toString('binary')
            }
            if (user && !_.isEmpty(user)) {
                this.setState({
                    email: user.email,
                    password: 'harcode',
                    fullName: user.fullName,
                    phoneNumber: user.phonenumber,
                    address: user.address,
                    gender: user.gender,
                    role: user.roleId,
                    avatar: '',
                    previewImgUrl: imageBase64,
                    userEditId: user.id
                })
            }
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

    checkValidateInput = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'fullName', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false
                alert('Missing parameter: ' + arrInput[i])
                break
            }
        }
        return isValid;
    }

    toggle = () => {
        this.props.toggleEditUserModal()
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }

        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                fullName: this.state.fullName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                avatar: this.state.avatar
            })
        }
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
            avatar: '',
            previewImgUrl: {}
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

    openPreviewImg = () => {
        if (!this.state.previewImgUrl) return
        this.setState({
            isOpen: true
        })
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary')
        }

        // console.log('check user from parent: ', user)
        this.setState({
            email: user.email,
            password: 'harcode',
            fullName: user.fullName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            avatar: '',
            previewImgUrl: imageBase64,
            userEditId: user.id
        })
    }

    render() {
        let roles = this.state.roleArr
        let language = this.props.language
        let { email, password, fullName, phoneNumber, address, role, avatar } = this.state
        console.log('check state edit: ', this.state)
        return (
            <Modal
                isOpen={this.props.isOpenModalEditUser}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id="manage-user.title-modal.tile-edit" />
                </ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.email" /></label>
                            <input className='form-control' type='email'
                                value={this.state.email}
                                onChange={(event) => { this.onChangeInput(event, 'email') }}
                                disabled
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.password" /></label>
                            <input className='form-control' type='password'
                                value={this.state.password}
                                onChange={(event) => { this.onChangeInput(event, 'password') }}
                                disabled
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.first-name" /></label>
                            <input className='form-control' type='text'
                                value={this.state.fullName}
                                onChange={(event) => { this.onChangeInput(event, 'fullName') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.address" /></label>
                            <input className='form-control' type='text'
                                value={this.state.address}
                                onChange={(event) => { this.onChangeInput(event, 'address') }}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.phone-number" /></label>
                            <input className='form-control' type='text'
                                value={this.state.phoneNumber}
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
                    <Button className='btn btn-success px-3' onClick={() => this.handleSaveUser()}>
                        <FormattedMessage id="manage-user.title-modal.edit" />

                    </Button>
                    <Button className='btn btn-danger px-3' color="secondary" onClick={() => this.toggle()}>
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
        editUserRedux: (data) => dispatch(actions.editUser(data)),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),

        //position
        getPositionStart: () => dispatch(actions.fetchPositionStart()),

        //role
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
