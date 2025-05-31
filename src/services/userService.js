import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const crateNewUserService = (data) => {
  console.log("check data from service: ", data);
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  // return axios.delete("/api/delete-user", { id: userId });
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllCodeService = (inputTpye) => {
  return axios.get(`/api/allcode?type=${inputTpye}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctors", data);
};
const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};
const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};

const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};
const getDetailSpecialtyById = (id) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${id}`);
};

const updateSpecialtyService = (data) => {
  return axios.put("/api/update-specialty", data);
};
const deleteSpecialtyService = (id) => {
  return axios.delete("/api/delete-specialty", {
    data: { id },
  });
};
const getDetailSpecialtyByIdNew = (data) => {
  return axios.get(
    `/api/get-detail-specialty-new-by-id?id=${data.id}&location=${data.location}`
  );
};

const createNewClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};
const getAllClinic = () => {
  return axios.get(`/api/get-clinic`);
};
const getDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};
const getDetailClinicByIdNew = (id) => {
  return axios.get(`/api/get-detail-clinic-new-by-id?id=${id}`);
};
const updateClinicService = (data) => {
  return axios.put("/api/update-clinic", data);
};

const deleteClinicService = (id) => {
  return axios.delete("/api/delete-clinic", {
    data: { id },
  });
};

const getAllPatientForDocter = (data) => {
  return axios.get(
    `/api/get-list-patient-for-dortor?doctorId=${data.doctorId}&date=${data.date}`
  );
};
const postSendKemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};

// Handbook
const createNewHandbook = (data) => {
  return axios.post("/api/create-new-handbook", data);
};

const getAllHandbook = () => {
  return axios.get(`/api/get-handbook`);
};

const getDetailHandbookById = (data) => {
  return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`);
};

const getDetailHandbookByIdNew = (id) => {
  return axios.get(`/api/get-detail-handbook-new-by-id?id=${id}`);
};

const updateHandbookService = (data) => {
  return axios.put("/api/update-handbook", data);
};

const deleteHandbookService = (id) => {
  return axios.delete("/api/delete-handbook", {
    data: { id },
  });
};
const saveVideoAbout = (data) => {
  return axios.post("/api/save-video-about", data);
};

const getAboutContent = () => {
  return axios.get("/api/get-about");
};

const deleteDoctor = (doctorId) => {
  return axios.delete("/api/delete-doctor-by-id", { data: { doctorId } });
};
export {
  handleLoginApi,
  getAllUsers,
  crateNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteClinicService,
  updateClinicService,
  updateSpecialtyService,
  deleteSpecialtyService,
  getDetailSpecialtyByIdNew,
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
  getAllPatientForDocter,
  postSendKemedy,
  getDetailClinicByIdNew,
  getAllHandbook,
  getDetailHandbookById,
  getDetailHandbookByIdNew,
  updateHandbookService,
  deleteHandbookService,
  createNewHandbook,
  saveVideoAbout,
  getAboutContent,
  deleteDoctor,
};
