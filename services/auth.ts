import { SuccessResponse } from "interfaces";
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  SocialLoginCredentials,
  VerifyCredentials,
} from "interfaces/user.interface";
import request from "./request";

const authService = {
  login: (data: LoginCredentials): Promise<SuccessResponse<LoginResponse>> =>
    request.post(`/auth/login`, data),
  register: (data: any) => request.post(`/auth/register`, {}, { params: data }),
  loginByGoogle: (data: SocialLoginCredentials) =>
    request.post(`/auth/google/callback`, data),
  loginByFacebook: (data: SocialLoginCredentials) =>
    request.post(`/auth/facebook/callback`, data),
  forgotPassword: (data: any) => request.post(`/auth/forgot/password`, data),
  verifyPhone: (data: any) =>
    request.post(`/auth/verify/phone`, {}, { params: data }),
  verifyEmail: (data: VerifyCredentials) =>
    request.get("/auth/verify/" + data.verifyId),
  registerComplete: (data: RegisterCredentials) =>
    request.post("/auth/after-verify", data),
  resendVerify: (data: any) =>
    request.post(`/auth/resend-verify`, {}, { params: data }),
  forgotPasswordEmail: (data: any) =>
    request.post("/auth/forgot/email-password", {}, { params: data }),
  forgotPasswordVerify: (data: any) =>
    request.post(
      `/auth/forgot/email-password/${data.verifyCode}`,
      {},
      { params: data }
    ),
  phoneRegisterComplete: (data: RegisterCredentials) =>
    request.post("/auth/verify/phone", data),
  forgotPasswordPhone: (data: any) =>
    request.post(`auth/forgot/password/confirm`, data),
};

export default authService;
