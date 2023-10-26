import { Paginate, Refund } from "interfaces";
import request from "./request";

const refundService = {
  getAll: (params?: any): Promise<Paginate<Refund>> =>
    request.get(`/dashboard/user/order-refunds/paginate`, { params }),
  create: (data: any) => request.post(`/dashboard/user/order-refunds`, data),
};

export default refundService;
