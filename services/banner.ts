import { Banner, IShop, Paginate, SuccessResponse } from "interfaces";
import request from "./request";

const bannerService = {
  getAll: (params?: any): Promise<Paginate<Banner>> =>
    request.get(`/rest/banners/paginate`, { params }),
  getById: (id: string, params?: any): Promise<SuccessResponse<Banner>> =>
    request.get(`/rest/banners/${id}`, { params }),
  getAllAds: (params?: any): Promise<Paginate<Banner>> =>
    request.get("/rest/banners-ads", { params }),
  getAdById: (id: string, params?: any): Promise<SuccessResponse<{banner: Banner, shops: IShop[]}>> => request.get(`/rest/banners-ads/${id}`, {params})
};

export default bannerService;
