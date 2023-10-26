import { CartType, SuccessResponse } from "interfaces";
import request from "./request";

const cartService = {
  guestStore: (data?: any): Promise<SuccessResponse<CartType>> =>
    request.post(`/rest/cart`, data),
  guestGet: (id: number, params?: any): Promise<SuccessResponse<CartType>> =>
    request.get(`/rest/cart/${id}`, { params }),
  store: (data?: any): Promise<SuccessResponse<CartType>> =>
    request.post(`/dashboard/user/cart`, data),
  get: (params?: any): Promise<SuccessResponse<CartType>> =>
    request.get(`/dashboard/user/cart`, { params }),
  deleteCartProducts: (data: any) =>
    request.delete(`/dashboard/user/cart/product/delete`, {
      data,
    }),
  delete: (data: any) =>
    request.delete(`/dashboard/user/cart/delete`, {
      data,
    }),
  insert: (data: any): Promise<SuccessResponse<CartType>> =>
    request.post(`/dashboard/user/cart/insert-product`, data),
  open: (data: any) => request.post(`/dashboard/user/cart/open`, data),
  setGroup: (id: number) =>
    request.post(`/dashboard/user/cart/set-group/${id}`),
  guestLeave: (params?: any) =>
    request.delete(`/rest/cart/member/delete`, { params }),
  join: (data: any) => request.post(`/rest/cart/open`, data),
  statusChange: (uuid: string, data: any) =>
    request.post(`/rest/cart/status/${uuid}`, data),
  deleteGuestProducts: (data: any) =>
    request.delete(`/rest/cart/product/delete`, {
      data,
    }),
  deleteGuest: (params: any) =>
    request.delete(`/dashboard/user/cart/member/delete`, { params }),
  insertGuest: (data: any): Promise<SuccessResponse<CartType>> =>
    request.post(`/rest/cart/insert-product`, data),
};

export default cartService;
