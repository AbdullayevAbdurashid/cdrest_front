import request from "./request";

const languageService = {
  getAllActive: (params?: any) =>
    request.get(`/rest/languages/active`, { params }),
};

export default languageService;
