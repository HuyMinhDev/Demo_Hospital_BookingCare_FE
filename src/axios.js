import axios from "axios";
// import _ from "lodash";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  //   withCredentials: true,
});

// const createError = (
//   httpStatusCode,
//   statusCode,
//   errorMessage,
//   problems,
//   errorCode = ""
// ) => {
//   const error = new Error();
//   error.httpStatusCode = httpStatusCode;
//   error.statusCode = statusCode;
//   error.errorMessage = errorMessage;
//   error.problems = problems;
//   error.errorCode = errorCode + "";
//   return error;
// };

// export const isSuccessStatusCode = (s) => {
//   // May be string or number
//   const statusType = typeof s;
//   return (
//     (statusType === "number" && s === 0) ||
//     (statusType === "string" && s.toUpperCase() === "OK")
//   );
// };

instance.interceptors.response.use((response) => {
  // Thrown error for request with OK status code
  const { data } = response;
  return response.data;
});
// axios
//   .post(
//     "http://localhost:6969/api/login",
//     {
//       username: "abc",
//       password: "abc",
//     },
//     {
//       withCredentials: true, // Cần thiết khi backend có `credentials: true`
//     }
//   )
//   .then((response) => console.log(response.data))
//   .catch((error) => console.error("Lỗi:", error));

export default instance;
