import React, { createContext, useState, useEffect } from "react";
import { loginAPI, loginForAdminAPI, signupAPI } from "@/services/authService";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getProfileUserAPI } from "@/services/userService";

export interface AuthContextProps {
  user: { manguoidung: number; vaitro: string } | null;
  userProfile: { tennguoidung: string; anhdaidien: string } | null;
  token: {
    accessToken: string;
  } | null;
  signup: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginForAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserProfile: React.Dispatch<
    React.SetStateAction<{ tennguoidung: string; anhdaidien: string } | null>
  >;
  isLoggedIn: () => boolean;
  resetPassword: () => void;
  updateUserAndToken: (
    newUser: { manguoidung: number; vaitro: string },
    newTokens: { accessToken: string }
  ) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<{
    accessToken: string;
  } | null>(null);

  const [user, setUser] = useState<{
    manguoidung: number;
    vaitro: string;
  } | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<{
    tennguoidung: string;
    anhdaidien: string;
  } | null>(null);

  const fetchUserProfile = async () => {
    try {
      const res = await getProfileUserAPI();
      setUserProfile(res);
    } catch (err) {
      console.log("Lỗi lấy hồ sơ:", err);
    }
  };

  useEffect(() => {
    const isAdminPath = window.location.pathname.startsWith("/admin");

    const savedUser = isAdminPath
      ? localStorage.getItem("admin_user")
      : localStorage.getItem("user");

    const savedTokens = isAdminPath
      ? localStorage.getItem("admin_tokens")
      : localStorage.getItem("tokens");

    if (savedUser && savedTokens) {
      const parsedUser = JSON.parse(savedUser);
      const parsedTokens = JSON.parse(savedTokens);

      setUser(parsedUser);
      setToken(parsedTokens);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedTokens.accessToken}`;
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedTokens.accessToken}`;
      fetchUserProfile();
    }

    setIsReady(true);
  }, []);

  const signup = async (
    email: string,
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await signupAPI(email, username, password);
      if (res.status === 200 || res.data.success) {
        toast.success(
          "🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        );
        return true;
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại.");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginAPI(email, password);
      if (res && res.tokens && res.user) {
        localStorage.setItem("tokens", JSON.stringify(res.tokens));
        localStorage.setItem("user", JSON.stringify(res.user));

        setToken(res.tokens);
        setUser(res.user);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.tokens.accessToken}`;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.tokens.accessToken}`;
        await fetchUserProfile();
        toast.success("Đăng nhập thành công!");
        return true;
      } else {
        toast.error("Phản hồi đăng nhập không hợp lệ!");
        return false;
      }
    } catch (error: any) {
      console.log(error.response);
      toast.error(error.response?.data?.error || "Có lỗi gì đó xảy ra");
      return false;
    }
  };

  const loginForAdmin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await loginForAdminAPI(email, password);
      if (res && res.tokens && res.user) {
        localStorage.setItem("admin_tokens", JSON.stringify(res.tokens));
        localStorage.setItem("admin_user", JSON.stringify(res.user));

        setToken(res.tokens);
        setUser(res.user);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.tokens.accessToken}`;
        toast.success("Đăng nhập admin thành công!");
        return true;
      }
      toast.error("Phản hồi đăng nhập admin không hợp lệ!");
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sai email hoặc mật khẩu");
      return false;
    }
  };

  const isLoggedIn = () => !!user && !!token;

  const logout = () => {
    if (user?.vaitro === "QUAN_TRI") {
      localStorage.removeItem("admin_tokens");
      localStorage.removeItem("admin_user");
    } else {
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    }

    setUser(null);
    setToken(null);
    setUserProfile(null);

    delete axiosInstance.defaults.headers.common["Authorization"];
    toast.success("Đã đăng xuất!");

    navigate("/");
  };

  const resetPassword = () => {
    console.log("Hi");
  };

  const updateUserAndToken = (
    newUser: { manguoidung: number; vaitro: string },
    newTokens: { accessToken: string }
  ) => {
    setUser(newUser);
    setToken(newTokens);

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("tokens", JSON.stringify(newTokens));

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newTokens.accessToken}`;
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newTokens.accessToken}`;
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        loginForAdmin,
        logout,
        signup,
        user,
        token,
        userProfile,
        setUserProfile,
        isLoggedIn,
        resetPassword,
        updateUserAndToken,
      }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => React.useContext(AuthContext);
