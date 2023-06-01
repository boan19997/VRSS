import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,

            isOpenModalUser: false,
            isOpenModalEditUser: false,

            userRedux: [],
            userEdit: {},
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id)
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
    }

    render() {
        let { language } = this.props
        let arrUsers = this.state.userRedux
        console.log('check user data: ', arrUsers)
        return (

            <div className='user-redux-container'>
                <ModalUser
                    isOpenModalUser={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                />
                <ModalEditUser
                    isOpenModalEditUser={this.state.isOpenModalEditUser}
                    toggleEditUserModal={this.toggleEditUserModal}
                    currentUser={this.state.userEdit}

                />
                <div className='title'>
                    <FormattedMessage id="menu.admin.manage-user" />
                </div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3 my-3 ml-3'
                        onClick={() => this.handleAddNewUser()}
                    ><i className="fas fa-plus mr-2"></i>
                        <FormattedMessage id="manage-user.add" />
                    </button>
                </div>
                <div className='col-12 mb-5'>
                    <table id='TableManageUser'>
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th><FormattedMessage id='manage-user.full-name' /></th>
                                <th><FormattedMessage id='manage-user.address' /></th>
                                <th><FormattedMessage id='manage-user.role' /></th>
                                <th style={{ textAlign: 'center' }}><FormattedMessage id='manage-user.action' /></th>
                            </tr>
                            {arrUsers && arrUsers.length > 0 &&
                                arrUsers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                {
                                                    language === LANGUAGES.VI ?
                                                        item.roleData.valueVi : item.roleData.valueEn
                                                }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditUser(item)}
                                                ><i className="fas fa-edit"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteUser(item)}
                                                ><i className="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {

        fetchUserRedux: () => dispatch(actions.fecthAllUserStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
