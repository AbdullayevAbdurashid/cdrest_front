import request from "./request";
import { Paginate, SuccessResponse } from "interfaces";
import {
  Parcel,
  ParcelFormValues,
  ParcelType,
} from "interfaces/parcel.interface";

type ParcelPrice = {
  price: number;
};

const parcelService = {
  getAll: (params?: string): Promise<Paginate<Parcel>> =>
    request.get(`/dashboard/user/parcel-orders?${params}`),
  getAllTypes: (params?: any): Promise<Paginate<ParcelType>> =>
    request.get(`/rest/parcel-order/types`, { params }),
  getById: (id: number, params?: any): Promise<SuccessResponse<Parcel>> =>
    request.get(`/dashboard/user/parcel-orders/${id}`, { params }),
  create: (data: ParcelFormValues): Promise<SuccessResponse<Parcel>> =>
    request.post(`/dashboard/user/parcel-orders`, data),
  calculate: (params: any): Promise<SuccessResponse<ParcelPrice>> =>
    request.get(`/rest/parcel-order/calculate-price`, { params }),
  cancel: (id: number) =>
    request.post(
      `/dashboard/user/parcel-orders/${id}/status/change?status=canceled`
    ),
  review: (id: number, data: any) =>
    request.post(`/dashboard/user/parcel-orders/deliveryman-review/${id}`, data),
};

export default parcelService;
