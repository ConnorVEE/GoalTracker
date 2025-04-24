import axiosInstance from "./axiosInstance";

export const loginUser = (email, password) => {
  return axiosInstance.post("/login/", { email, password });
};

export const logoutUser = () => {
  return axiosInstance.post("/logout/", {});
};

export const registerUser = (firstName, lastName, email, password) => {
    return axiosInstance.post("/register/", {
      firstName,
      lastName,
      email,
      password,
    });
  };