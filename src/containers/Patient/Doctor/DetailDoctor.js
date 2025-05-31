import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import LikeAndShare from "../socialPlugin/LikeAndShare";
import Comment from "../socialPlugin/Comment";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });

      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      } else {
        console.error("Failed to fetch doctor detail", res);
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { language } = this.props;
    let { detailDoctor } = this.state;
    let nameVi = "";
    let nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName} `;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }
    let currentURL1 =
      process.env.REACT_APP_IS_LOCALHOST === "1"
        ? "https://www.facebook.com/permalink.php?story_fbid=pfbid0Y47aFGTS9q8AMKSF45kWNZezoMid26DtK3DZhgvRJFR1BHH747TK9zLAmhirfLcMl&id=61557876208398&__cft__[0]=AZXidQRNaJwmjV5VlZyG4R3VkoUqWVYr25NspR4UXHTsAmdktObppmiD_5oZxldnqneiiXyW4-gDsnPb0FRGr6hM5JxPx8dPOdjPhJDPA1r0H5xreTVBd7CBvbAhlm_16c_OlfG9QfYx1w7nkd6teKl4Z6M5EAaqqZ-jimi9pnlvaAT7eJJ8Z_vRjlsadCcqLfUkzvB4GufYaH5U3l5Y_zY2ae3rWClK0ubQeHIA9DdiW85V1ELBO-YSRCbDHrIFLko&__tn__=%2CO%2CP-R"
        : window.location.href;

    let currentURL = `${window.location.origin}/detail-doctor/${this.state.currentDoctorId}`;

    // let currentURL =
    //   process.env.REACT_APP_IS_LOCALHOST === "1"
    //     ? "https://eric-restaurant-bot-tv.herokuapp.com/"
    //     : window.location.href;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                {detailDoctor &&
                  detailDoctor.Markdown &&
                  detailDoctor.Markdown.description && (
                    <span>{detailDoctor.Markdown.description}</span>
                  )}
                <div className="like-share-plugin">
                  <LikeAndShare dataHref={currentURL} />
                </div>
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detailDoctor &&
              detailDoctor.Markdown &&
              detailDoctor.Markdown.contentHTML && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor.Markdown.contentHTML,
                  }}
                ></div>
              )}
          </div>
          <div className="comment-doctor">
            <div className="comment-doctor">
              <Comment numPost={5} dataHref={currentURL1} width={"100%"} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
