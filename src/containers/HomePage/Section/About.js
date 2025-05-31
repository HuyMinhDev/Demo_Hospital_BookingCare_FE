import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAboutContent } from "../../../services/userService";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoLink: "",
      descriptionHTML: "",
    };
  }

  async componentDidMount() {
    const res = await getAboutContent();
    if (res && res.errCode === 0 && res.data) {
      const { videoLink, descriptionHTML } = res.data;
      this.setState({ videoLink, descriptionHTML });
    }
  }
  convertYoutubeLink(link) {
    if (!link) return "";
    return link.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
  }
  render() {
    const { videoLink, descriptionHTML } = this.state;

    return (
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">
            <FormattedMessage
              id="homepage.about-title"
              defaultMessage="Truyền thông nói về bệnh viện"
            />
          </h2>

          <div className="row">
            {/* Video */}
            <div className="col-12 col-md-6 mb-4 mb-md-0">
              <div className="ratio ratio-16x9">
                <iframe
                  src={this.convertYoutubeLink(videoLink)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Mô tả */}
            <div className="col-12 col-md-6">
              <div
                className="lead text-muted"
                dangerouslySetInnerHTML={{ __html: descriptionHTML }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(About);
