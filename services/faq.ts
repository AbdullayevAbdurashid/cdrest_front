import { Faq, IPrivacy, Paginate, SuccessResponse } from "interfaces";
import request from "./request";

const faqService = {
  getAll: (params?: any): Promise<Paginate<Faq>> =>
    request.get(`/rest/faqs/paginate`, { params }),
  getPrivacy: (params?: any): Promise<SuccessResponse<IPrivacy>> =>
    request.get(`/rest/policy`, { params }),
  getTerms: (params?: any): Promise<SuccessResponse<IPrivacy>> =>
    request.get(`/rest/term`, { params }),
};

export default faqService;
