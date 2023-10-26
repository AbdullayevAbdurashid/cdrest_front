import { SuccessResponse, IPage, Paginate } from "interfaces";
import request from "./request";
import { ILandingPage, IStatistics } from "interfaces/page.interface";

const pageService = {
  getDeliverPage: (params?: any): Promise<SuccessResponse<IPage>> =>
    request.get(`/rest/pages/delivery`, { params }),
  getAboutPage: (params?: any): Promise<SuccessResponse<IPage>> =>
    request.get(`/rest/pages/about`, { params }),
  getAboutSections: (): Promise<Paginate<IPage>> =>
    request.get(`/rest/pages/paginate?page=1&perPage=10&type=all_about`),
  getLandingPage: (params?: any): Promise<SuccessResponse<ILandingPage>> =>
    request.get(`/rest/landing-pages/welcome`, { params }),
  getStatistics: (params?: any): Promise<SuccessResponse<IStatistics>> =>
    request.get(`/rest/stat`, { params }),
};

export default pageService;
