import { Paginate, SuccessResponse } from "interfaces";
import { ICareer } from "interfaces/career.interface";
import request from "./request";

const careerService = {
  getAll: (params?: any): Promise<Paginate<ICareer>> =>
    request.get(`/rest/careers/paginate`, { params }),
  getById: (id: number, params?: any): Promise<SuccessResponse<ICareer>> =>
    request.get(`/rest/careers/${id}`, { params }),
};

export default careerService;
