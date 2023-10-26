import { SuccessResponse } from "interfaces";
import { IUser } from "interfaces/user.interface";
import request from "./request";

const profileService = {
  update: (data: any): Promise<SuccessResponse<IUser>> =>
    request.put(`/dashboard/user/profile/update`, data),
  passwordUpdate: (data: any) =>
    request.post(`/dashboard/user/profile/password/update`, data),
  get: (params?: any, headers?: any): Promise<SuccessResponse<IUser>> =>
    request.get(`/dashboard/user/profile/show`, { params, headers }),
  getNotifications: (params?: any) =>
    request.get(`/dashboard/user/notifications`, { params }),
  updateNotifications: (data: any) =>
    request.post(`/dashboard/user/update/notifications`, data),
  firebaseTokenUpdate: (data: any) =>
    request.post(`/dashboard/user/profile/firebase/token/update`, data),
  updatePhone: (params: any): Promise<SuccessResponse<IUser>> =>
    request.put(`/dashboard/user/profile/update`, {}, { params }),
};

export default profileService;
