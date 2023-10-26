import { IBranch, Paginate, SuccessResponse } from "interfaces";
import request from "./request";

const branchService = {
  getAll: (params?: any): Promise<Paginate<IBranch>> =>
    request.get(`/rest/branches`, { params }),
  getById: (id: number, params?: any): Promise<SuccessResponse<IBranch>> =>
    request.get(`/rest/branches/${id}`, { params }),
};

export default branchService;
