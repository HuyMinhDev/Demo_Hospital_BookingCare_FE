import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import "./RemedyModal.scss";
import { CommonUtils } from "../../../utils";
class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.dataModal?.email || "",
      imgBase64: "",
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal?.email || "",
      });
    }
  }

  // handleChangeEmail = (e) => {
  //
  // };

  // handleFileChange = (e) => {
  //   this.setState({ imgBase64: e.target.imgBase64[0] });
  // };

  handleSendRemedy = () => {
    const { email, imgBase64 } = this.state;
    if (!email) {
      toast.error("Vui lòng nhập email ");
      return;
    }
    if (!imgBase64) {
      toast.error("Vui lòng chọn ảnh hóa đơn");
      return;
    }
    this.props.sendRemedy(this.state);

    // console.log(">>>> Check modal sendremedy: ", this.state);
  };
  hanleOnchangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleOnchangeImg = async (event) => {
    let data = event.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      this.setState({
        imgBase64: base64,
      });
    } else {
      this.setState({
        previewImgUrl: "",
      });
    }
  };
  render() {
    const { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
    // const { email } = this.state;

    return (
      <Modal isOpen={isOpenModal} className="remedy-modal-container" centered>
        <ModalHeader toggle={closeRemedyModal}>
          Gửi hóa đơn khám bệnh
        </ModalHeader>
        <ModalBody>
          <div className="remedy-form">
            <div className="form-group">
              <label>Email bệnh nhân</label>
              <input
                type="email"
                className="form-control"
                value={this.state.email}
                onChange={(event) => this.hanleOnchangeEmail(event)}
              />
            </div>

            <div className="form-group mt-3">
              <label>Chọn file hóa đơn</label>
              <input
                type="file"
                className="form-control"
                onChange={(event) => this.handleOnchangeImg(event)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSendRemedy}>
            Gửi
          </Button>{" "}
          <Button color="secondary" onClick={closeRemedyModal}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(RemedyModal);
