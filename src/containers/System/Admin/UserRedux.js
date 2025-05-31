import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils/constant";
import { CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";

import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
// import { add, create } from "lodash";
import TableManageUser from "./TableManageUser";
// import { set } from "lodash";
class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgUrl: "",
      isOpen: false,

      // Thêm user
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      action: "",
      userEditId: "",
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
    // this.props.dispatch(actions.fetchGenderStart());

    // try {
    //   let res = await getAllCodeService("gender");
    //   if (res && res.errCode === 0) {
    //     this.setState({ genderArr: res.data });
    //   }
    //   console.log("check res: ", res);
    // } catch (error) {
    //   console.error("Error fetching user types:", error);
    // }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // render => didupdate => action => setState
    // Hiện tại (this) và quá khứ (previous)
    // []  [3]
    // [3] [3]
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;

      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      });
    }
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrRoles = this.props.roleRedux;
      let arrPositions = this.props.positionRedux;
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
        avatar: "",

        action: CRUD_ACTIONS.CREATE,
        previewImgUrl: "",
      });
    }
  }

  handleOnchangeImg = async (event) => {
    let data = event.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgUrl: objectUrl,
        avatar: base64,
      });
    } else {
      this.setState({
        previewImgUrl: "",
      });
    }
  };
  openPreviewImg = () => {
    if (!this.state.previewImgUrl) return;
    this.setState({
      isOpen: true,
    });
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      // fire redux create user
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phonenumber: this.state.phoneNumber,
        address: this.state.address,
        gender: this.state.gender,
        positionId: this.state.position,
        roleId: this.state.role,
        avatar: this.state.avatar,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      // fire redux create user
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phonenumber: this.state.phoneNumber,
        address: this.state.address,
        gender: this.state.gender,
        positionId: this.state.position,
        roleId: this.state.role,
        avatar: this.state.avatar,
      });
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("Missing parameter: " + arrCheck[i]);
        console.log("check validate input: ", typeof this.state[arrCheck[i]]);
        console.log("check validate input11: ", arrCheck[i]);
        break;
      }
    }
    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    console.log("check onChangeInput1: ", copyState);
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    this.setState({
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phonenumber,
      address: user.address,
      gender: user.gender,
      role: user.roleId,
      position: user.positionId,
      avatar: "",
      previewImgUrl: imageBase64,
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  render() {
    const { intl } = this.props;
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      role,
      position,
      avatar,
    } = this.state;

    return (
      <div className="user-redux-container">
        <div className="title">User Redux Huy</div>

        <div className="text-redux-body">
          <div className="container">
            <div className="row">
              <form>
                <div className="row">
                  <div className="col-md-12 my-3 fw-bold fs-10">
                    <FormattedMessage id="manage-user.add" />
                  </div>
                  <div className="col-md-12">
                    {isGetGenders === true ? "Loading genders" : ""}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="inputEmail4" className="form-label">
                      <FormattedMessage id="manage-user.email" />
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail4"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-email",
                      })}
                      value={email}
                      onChange={(event) => this.onChangeInput(event, "email")}
                      disabled={
                        this.state.action === CRUD_ACTIONS.EDIT ? true : false
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="inputPassword4" className="form-label">
                      <FormattedMessage id="manage-user.password" />
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="inputPassword4"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-password",
                      })}
                      value={password}
                      onChange={(event) =>
                        this.onChangeInput(event, "password")
                      }
                      disabled={
                        this.state.action === CRUD_ACTIONS.EDIT ? true : false
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      <FormattedMessage id="manage-user.first-name" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-first-name",
                      })}
                      value={firstName}
                      onChange={(event) =>
                        this.onChangeInput(event, "firstName")
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      <FormattedMessage id="manage-user.last-name" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-last-name",
                      })}
                      value={lastName}
                      onChange={(event) =>
                        this.onChangeInput(event, "lastName")
                      }
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      <FormattedMessage id="manage-user.phone-number" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-number",
                      })}
                      value={phoneNumber}
                      onChange={(event) =>
                        this.onChangeInput(event, "phoneNumber")
                      }
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label htmlFor="address" className="form-label">
                      <FormattedMessage id="manage-user.address" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder={intl.formatMessage({
                        id: "manage-user.pl-address",
                      })}
                      value={address}
                      onChange={(event) => this.onChangeInput(event, "address")}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="gender" className="form-label">
                      <FormattedMessage id="manage-user.gender" />
                    </label>
                    <select
                      id="gender"
                      className="form-select"
                      defaultValue=""
                      onChange={(event) => this.onChangeInput(event, "gender")}
                      value={gender}
                    >
                      <option value="" disabled>
                        {intl.formatMessage({
                          id: "manage-user.select-gender",
                        })}
                      </option>
                      {genders &&
                        genders.length > 0 &&
                        genders.map((item, index) => {
                          return (
                            <option key={index} value={item.keyMap}>
                              {language === LANGUAGES.VI
                                ? item.valueVi
                                : item.valueEn}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="position" className="form-label">
                      <FormattedMessage id="manage-user.position" />
                    </label>
                    <select
                      id="position"
                      className="form-select"
                      defaultValue=""
                      onChange={(event) =>
                        this.onChangeInput(event, "position")
                      }
                      value={position}
                    >
                      <option value="" disabled>
                        {intl.formatMessage({
                          id: "manage-user.select-position",
                        })}
                      </option>
                      {positions &&
                        positions.length > 0 &&
                        positions.map((item, index) => {
                          return (
                            <option key={index} value={item.keyMap}>
                              {language === LANGUAGES.VI
                                ? item.valueVi
                                : item.valueEn}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="roleId" className="form-label">
                      <FormattedMessage id="manage-user.role" />
                    </label>
                    <select
                      id="roleId"
                      className="form-select"
                      defaultValue=""
                      onChange={(event) => this.onChangeInput(event, "role")}
                      value={role}
                    >
                      <option value="" disabled>
                        {intl.formatMessage({
                          id: "manage-user.select-role",
                        })}
                      </option>
                      {roles &&
                        roles.length > 0 &&
                        roles.map((item, index) => {
                          return (
                            <option key={index} value={item.keyMap}>
                              {language === LANGUAGES.VI
                                ? item.valueVi
                                : item.valueEn}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="image" className="form-label">
                      <FormattedMessage id="manage-user.image" />
                    </label>
                    <div className="preview-img-container">
                      <input
                        type="file"
                        className="form-control-file"
                        id="previewImg"
                        hidden
                        onChange={(event) => this.handleOnchangeImg(event)}
                      />
                      <label className="label-upload" htmlFor="previewImg">
                        Tải ảnh
                        <i className="fa-solid fa-upload"></i>
                      </label>
                      {this.state.previewImgUrl && (
                        <div
                          className="preview-image"
                          style={{
                            backgroundImage: `url(${this.state.previewImgUrl})`,
                          }}
                          onClick={() => this.openPreviewImg()}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 my-3">
                  <button
                    type="button"
                    className={
                      this.state.action === CRUD_ACTIONS.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    onClick={() => this.handleSaveUser()}
                  >
                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                      <FormattedMessage id="manage-user.edit" />
                    ) : (
                      <FormattedMessage id="manage-user.create" />
                    )}
                  </button>
                </div>
                <div className="col-md-12 my-3">
                  <TableManageUser
                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                    action={this.state.action}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) =>
    //   dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(UserRedux));
