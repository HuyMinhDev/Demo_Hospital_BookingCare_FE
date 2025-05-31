import React, { Component } from "react";

import { connect } from "react-redux";

import HomeHeader from "./HomeHeader.js";
import Specialty from "./Section/Specialty.js";
import MedicalFacility from "./Section/MedicalFacility.js";
import OutStandingDoctor from "./Section/OutStandingDoctor.js";
import HandBook from "./Section/HandBook.js";
import About from "./Section/About.js";
import HomeFooter from "./HomeFooter.js";
import "./HomePage.scss";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BackToTop from "../../components/BackToTop.js";
class HomePage extends Component {
  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500, // Giảm thời gian chuyển động để phản hồi nhanh hơn
      slidesToShow: 4,
      slidesToScroll: 1,
      cssEase: "linear", // Giúp kéo trơn tru hơn
      pauseOnHover: true,
      swipe: true, // Cho phép vuốt trên cả chuột và cảm ứng
      draggable: true, // Bật kéo bằng chuột
      touchThreshold: 20, // Tăng độ nhạy khi kéo

      responsive: [
        {
          breakpoint: 1024, // Với màn hình <= 1024px
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768, // Với màn hình <= 768px
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576, // Với màn hình <= 576px (mobile)
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <Specialty settings={settings} />
        <MedicalFacility settings={settings} />
        <OutStandingDoctor settings={settings} />
        <HandBook settings={settings} />
        <About />
        <HomeFooter />
        <BackToTop />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
