import { AuthProvider } from "react-admin";
import axios from "axios";

interface LoginParams {
  username: string;
  password: string;
}

interface CheckParams {
  status: number;
}

export const authProvider: AuthProvider = {
  // called when the user attempts to log in
  login: async ({ username, password }: LoginParams) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Store the JWT token in local storage
      const token = response.data["jwt-token"];
      localStorage.setItem("jwt-token", token);
      localStorage.setItem("username", username);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new Error("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.")
      );
    }
  },

  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  // called when the API returns an error
  checkError: ({ status }: CheckParams) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("jwt-token");
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("jwt-token")
      ? Promise.resolve()
      : Promise.reject();
  },

  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
