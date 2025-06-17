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
    setTimeout(() => {
      const container = this.props.scrollRef?._container; // Truy cập vùng scroll bên trong CustomScrollbars

      if (container) {
        this.scrollContainer = container;
        this.scrollContainer.addEventListener("scroll", this.toggleVisibility);
      }
    }, 0);
  }

  componentWillUnmount() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener("scroll", this.toggleVisibility);
    }
  }

  toggleVisibility = () => {
    if (this.scrollContainer?.scrollTop > 300) {
      this.setState({ isVisible: true });
    } else {
      this.setState({ isVisible: false });
    }
  };

  scrollToTop = () => {
    if (this.scrollContainer) {
      this.scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  render() {
    const { isVisible } = this.state;

    return (
      isVisible && (
        <button className="back-to-top" onClick={this.scrollToTop}>
          ⬆
        </button>
      )
    );
  }
}

export default BackToTop;
