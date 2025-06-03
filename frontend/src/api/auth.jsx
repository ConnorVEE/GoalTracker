import axiosInstance from "./axiosInstance";

export const loginUser = (email, password) => {
  return axiosInstance.post("/login/", { email, password });
};

export const logoutUser = () => {
  return axiosInstance.post("/logout/", {});
};

export const registerUser = (first_name, last_name, email, password) => {
    return axiosInstance.post("/register/", {
      first_name,
      last_name,
      email,
      password,
    });
  };

  