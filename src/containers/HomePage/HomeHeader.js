import React, { Component } from "react";

import { connect } from "react-redux";
import "./HomeHeader.scss";
import iconHospital from "../../assets/icon-hospital.png";
import iconTuXa from "../../assets/icon-tuxa.png";
import iconKhamTongQuan from "../../assets/iconkham-tong-quan.png";
import iconXetNghiemYHoc from "../../assets/iconxet-nghiem-y-hoc.png";
import iconSucKhoeTinhThan from "../../assets/iconsuc-khoe-tinh-than.png";
import iconKhamNhaKhoa from "../../assets/iconkham-nha-khoa.png";
import logo from "../../assets/Logo-Bookingcare.svg";
import { FormattedMessage, injectIntl } from "react-intl";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom";
import {
  getAllSpecialty,
  getAllDoctors,
  getAllClinic,
} from "../../services/userService";
// import util from "../../utils/util";
import { removeVietnameseTones } from "../../utils/util1";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import SpecialtyList from "./Section/SpecialtyList";
class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      filteredList: [],
      fullList: [],
    };
  }
  async componentDidMount() {
    try {
      const [specialtyRes, doctorRes, clinicRes] = await Promise.all([
        getAllSpecialty(),
        getAllDoctors(),
        getAllClinic(),
      ]);

      let specialtyList = [];
      let doctorList = [];
      let clinicList = [];

      if (specialtyRes?.errCode === 0) {
        specialtyList = specialtyRes.data.map((item) => ({
          ...item,
          type: "specialty",
        }));
      }

      if (doctorRes?.errCode === 0) {
        doctorList = doctorRes.data.map((item) => ({
          ...item,
          name: item.lastName + " " + item.firstName,
          image: item.image,
          id: item.id,
          type: "doctor",
        }));
      }

      if (clinicRes?.errCode === 0) {
        clinicList = clinicRes.data.map((item) => ({
          ...item,
          type: "clinic",
        }));
      }

      this.setState({
        fullList: [...specialtyList, ...doctorList, ...clinicList],
      });
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  }

  handleSearchChange = (e) => {
    const keyword = e.target.value;
    const searchKeyword = removeVietnameseTones(keyword.toLowerCase());

    const filtered = this.state.fullList.filter((item) =>
      removeVietnameseTones(item.name.toLowerCase()).includes(searchKeyword)
    );

    this.setState({
      searchTerm: keyword,
      filteredList: filtered,
    });
  };
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };
  render() {
    let language = this.props.language;
    const { intl } = this.props;

    return (
      <React.Fragment>
        <nav
          className="navbar navbar-expand-lg navbar-light sticky-top shadow-sm"
          style={{ backgroundColor: "#edfffa" }}
        >
          <div className="container d-flex justify-content-between align-items-center">
            {/* Logo và nút toggle */}
            <div className="item-logo d-flex align-items-center">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
                aria-controls="mainNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-menu">
                  <i className="fa-solid fa-bars"></i>
                </span>
              </button>
              <Link
                className="logo-img navbar-brand d-flex align-items-center ms-2"
                to="/home"
              >
                <img src={logo} alt="Logo" />
              </Link>
            </div>

            {/* Right content: Hỗ trợ và ngôn ngữ (luôn hiển thị ngoài collapse) */}
            <div className="language-icon d-flex align-items-center order-lg-2 ms-auto">
              <div className="title-suport me-3 d-flex align-items-center">
                <i className="fas fa-question-circle me-1"></i>
                <FormattedMessage id="homeheader.support" />
              </div>
              <button
                className={`btn btn-sm me-2 ${
                  language === LANGUAGES.VI
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => this.changeLanguage(LANGUAGES.VI)}
              >
                VN
              </button>
              <button
                className={`btn btn-sm ${
                  language === LANGUAGES.EN
                    ? "btn-warning"
                    : "btn-outline-warning"
                }`}
                onClick={() => this.changeLanguage(LANGUAGES.EN)}
              >
                EN
              </button>
            </div>

            {/* Collapse navbar menu */}
            <div
              className="collapse navbar-collapse order-lg-1"
              id="mainNavbar"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item text-center mx-2">
                  <Link className="nav-link" to="/list-specialty">
                    <div className="item-title">
                      <strong>
                        <FormattedMessage id="homeheader.speciality" />
                      </strong>
                      <br />
                      <span className="text-muted small">
                        <FormattedMessage id="homeheader.searchdoctor" />
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="nav-item text-center mx-2">
                  <Link className="nav-link" to="/list-clinic">
                    <div className="item-title">
                      <strong>
                        <FormattedMessage id="homeheader.health-facility" />
                      </strong>
                      <br />
                      <span className="text-muted small">
                        <FormattedMessage id="homeheader.select-room" />
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="nav-item text-center mx-2">
                  <Link className="nav-link" to="/list-doctor">
                    <div className="item-title">
                      <strong>
                        <FormattedMessage id="homeheader.doctor" />
                      </strong>
                      <br />
                      <span className="text-muted small">
                        <FormattedMessage id="homeheader.select-doctor" />
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="nav-item text-center mx-2">
                  <Link className="nav-link" to="/list-handbook">
                    <div className="item-title">
                      <strong>
                        <FormattedMessage id="homeheader.fee" />
                      </strong>
                      <br />
                      <span className="text-muted small">
                        <FormattedMessage id="homeheader.check-health" />
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-11 col-md-8 col-lg-6">
                    <div className="search-title d-flex align-items-center bg-warning rounded-pill px-3 py-2">
                      <i className="fas fa-search me-2 fs-4"></i>
                      <input
                        type="text"
                        className="form-control border-0 bg-transparent shadow-none"
                        placeholder={intl.formatMessage({
                          id: "banner.search-placeholder",
                        })}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                      />
                    </div>
                    {this.state.searchTerm && (
                      <div className="search-item mt-2 bg-warning p-3 rounded">
                        <SpecialtyList data={this.state.filteredList} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="content-down">
              <div className="container text-center pb-3">
                <div className="options-grid">
                  <div className="options-child">
                    <Link className="nav-link" to="/list-specialty">
                      <div className="icon-child">
                        <img src={iconHospital} alt="iconHospital" />
                      </div>
                      <div className="text-child">
                        <FormattedMessage id="banner.child3" />
                      </div>
                    </Link>
                  </div>
                  <div className="options-child">
                    <div
                      className="nav-link"
                      onClick={() => {
                        const section = document.getElementById("about");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="icon-child">
                        <img src={iconTuXa} alt="iconTuXa" />
                      </div>
                      <div className="text-child">
                        <FormattedMessage id="banner.child4" />
                      </div>
                    </div>
                  </div>
                  <div className="options-child">
                    <Link className="nav-link" to="/list-handbook">
                      <div className="icon-child">
                        <img src={iconKhamTongQuan} alt="iconKhamTongQuan" />
                      </div>
                      <div className="text-child">
                        <FormattedMessage id="banner.child5" />
                      </div>
                    </Link>
                  </div>
                  <div className="options-child">
                    <Link className="nav-link" to="/list-clinic">
                      <div className="icon-child">
                        <img src={iconXetNghiemYHoc} alt="iconXetNghiemYHoc" />
                      </div>
                      <div className="text-child">
                        <FormattedMessage id="banner.child6" />
                      </div>
                    </Link>
                  </div>
                  <div className="options-child">
                    <Link className="nav-link" to="/list-doctor">
                      <div className="icon-child">
                        <img
                          src={iconSucKhoeTinhThan}
                          alt="iconSucKhoeTinhThan"
                        />
                      </div>
                      <div className="text-child">
                        <FormattedMessage id="banner.child7" />
                      </div>
                    </Link>
                  </div>
                  {/* <div className="options-child">
                    <div className="icon-child">
                      <img src={iconKhamNhaKhoa} alt="iconKhamNhaKhoa" />
                    </div>
                    <div className="text-child">
                      <FormattedMessage id="banner.child8" />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader))
);
