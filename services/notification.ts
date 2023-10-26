import { Paginate, SuccessResponse } from "interfaces";
import {
  IUserPushNotification,
  IUserPushNotificationStats,
} from "interfaces/user.interface";
import request from "./request";

const notificationService = {
  getAll: (params?: any): Promise<Paginate<IUserPushNotification>> =>
    request.get(`/dashboard/notifications`, { params }),
  getById: (
    id: number,
    params?: any
  ): Promise<SuccessResponse<IUserPushNotification>> =>
    request.get(`/dashboard/notifications/${id}`, { params }),
  getStatistics: (params?: any): Promise<IUserPushNotificationStats> =>
    request.get(`/dashboard/user/profile/notifications-statistic`, { params }),
  readAll: (data?: any) =>
    request.post(`/dashboard/notifications/read-all`, data),
  readById: (id: number, data?: any) =>
    request.post(`/dashboard/notifications/${id}/read-at`, data),
};

export default notificationService;
