import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import './ManageCenter.scss'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select'
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { saveDetailCenter } from '../../../services/userService';
import { getDetailInforCenter } from '../../../services/userService';

const options = [
    { value: 'chocolate', label: 'chocolate' },
    { value: 'strawberry', label: 'strawberry' },
    { value: 'vanilla', label: 'vanilla' }
]

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageCenter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: null,
            description: '',
            listCenters: [],
            hasOldata: false,

            //save to doctor infor doctor
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            note: '',
        }
    }

    componentDidMount() {
        this.props.fecthAllCenter()
        this.props.getRequiedCenterInfor()
    }

    buildDataSelect = (data, type) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            if (type === 'USERS') {
                data.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.fullName}`
                    let labelEn = `${item.fullName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object)
                })
            }

            //type PRICE viết riêng để thêm giá tiền là USD khi tiếng anh
            if (type === 'PRICE') {
                data.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn} USD`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object)
                })
            }

            if (type === 'PAYMENT' || type === 'PROVINCE') {
                data.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
        }
        return result
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelected = this.buildDataSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listCenters: dataSelected
            })
        }
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor
            let dataSelectPrice = this.buildDataSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataSelect(resProvince, 'PROVINCE')
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelected = this.buildDataSelect(this.props.allDoctors, 'USERS')
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor
            let dataSelectPrice = this.buildDataSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataSelect(resProvince, 'PROVINCE')
            this.setState({
                listCenters: dataSelected,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldata } = this.state
        this.props.saveDetailCenter({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            centerId: this.state.selectedOption.value,
            action: hasOldata === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            //data lưu vào doctor_infor
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            note: this.state.note,
        })
        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            selectedOption: null,
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            note: '',

        })
    }


    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption })
        let { listPayment, listPrice, listProvince } = this.state

        let res = await getDetailInforCenter(selectedOption.value)
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown

            let priceId = '', paymentId = '', provinceId = '', note = '',
                selectedPrice = '', selectedPayment = '', selectedProvince = ''

            if (res.data.Center_Infor) {
                note = res.data.Center_Infor.note

                paymentId = res.data.Center_Infor.paymentId
                priceId = res.data.Center_Infor.priceId
                provinceId = res.data.Center_Infor.provinceId

                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
            }



            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldata: true,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                note: note,
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldata: false,
                note: '',
            })
        }
        console.log('check res: ', res)
    }

    handleChangeDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption

        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let { hasOldata } = this.state
        // console.log('check state: ', this.state)
        return (
            <div className='manage-center-container'>
                <div className='manage-center-title'>
                    <FormattedMessage id="admin.manage-center.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-center.choose" />
                        </label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listCenters}
                            //thêm thuộc tính placehoder 
                            placeholder={<FormattedMessage id="admin.manage-center.choose" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label>
                            <FormattedMessage id="admin.manage-center.intro" />
                        </label>
                        <textarea className='form-control' rows='2'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >
                            <FormattedMessage id="admin.manage-center.infor-center" />
                        </textarea>
                    </div>
                </div>
                <div className='more-infor-extra row'>
                    <div className='col-3 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-center.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listPrice}
                            //thêm thuộc tính placehoder 
                            placeholder={<FormattedMessage id="admin.manage-center.choose-price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-center.payment" />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listPayment}
                            //thêm thuộc tính placehoder 
                            placeholder={<FormattedMessage id="admin.manage-center.choose-payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-center.province" />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listProvince}
                            //thêm thuộc tính placehoder 
                            placeholder={<FormattedMessage id="admin.manage-center.choose-province" />}
                            name="selectedProvince"
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-center.note" />
                        </label>
                        <input
                            className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='manage-center-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className='text-right'>
                    <button className={hasOldata === true ? 'btn save-content-doctor' : 'btn create-content-doctor'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {hasOldata === true ?
                            <span>
                                <FormattedMessage id="admin.manage-center.save-infor" />
                            </span> : <span>
                                <FormattedMessage id="admin.manage-center.create-infor" />
                            </span>
                        }
                    </button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fecthAllCenter: () => dispatch(actions.fecthAllCenter()),
        saveDetailCenter: (data) => dispatch(actions.saveDetailCenter(data)),

        getRequiedCenterInfor: () => dispatch(actions.getRequiedCenterInfor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCenter);
