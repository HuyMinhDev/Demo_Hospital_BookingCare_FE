import React, { Component } from "react";
import "./BackToTop.scss";

class BackToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.toggleVisibility);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.toggleVisibility);
  }

  toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      this.setState({ isVisible: true });
    } else {
      this.setState({ isVisible: false });
    }
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    return (
      this.state.isVisible && (
        <div className="back-to-top" onClick={this.scrollToTop}>
          ↑
        </div>
      )
    );
  }
}

export default BackToTop;
