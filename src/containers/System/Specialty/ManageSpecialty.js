import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils, LANGUAGES } from "../../../utils";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";
// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImgURL: null,
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      // Handle language change if needed
    }
  }

  handleOnchangeImg = async (event) => {
    let data = event.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        imageBase64: base64,
      });
    } else {
      this.setState({
        previewImgURL: "",
      });
    }
  };
  handleOnchangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
    console.log("handleEditorChange", html, text);
  };
  handleSaveNewSpecialty = async () => {
    // console.log(">>>>>> Check this.state: ", this.state);
    let res = await createNewSpecialty(this.state);
    if (res && res.errCode === 0) {
      toast.success("Add new specialty successed!");
      if (this.fileInputRef.current) {
        this.fileInputRef.current.value = null;
      }
      this.setState({
        previewImgURL: null,
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("Add new specialty Faled!");
      console.log("Check error res: ", res);
    }
  };
  render() {
    const { previewImgURL } = this.state;

    return (
      <div className="container manage-specialty-container">
        <h4 className="ms-title mb-1">
          <FormattedMessage id="admin.manage-doctor.manage-specialty" />
        </h4>

        <div className="add-new-specialty row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.nameSpecialty" />
            </label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnchangeInput(event, "name")}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">
              <FormattedMessage id="admin.manage-doctor.imageSpecialty" />
            </label>
            <input
              className="form-control"
              type="file"
              onChange={(event) => this.handleOnchangeImg(event)}
              ref={this.fileInputRef}
            />
            {previewImgURL && (
              <div className="mt-2">
                <img
                  src={previewImgURL}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">
            <FormattedMessage id="admin.manage-doctor.desSpecialty" />
          </label>
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.descriptionMarkdown}
          />
        </div>
        <div className="col-12">
          <button
            onClick={() => this.handleSaveNewSpecialty()}
            className="btn btn-primary"
          >
            <FormattedMessage id="admin.manage-doctor.create-speciality" />
          </button>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
