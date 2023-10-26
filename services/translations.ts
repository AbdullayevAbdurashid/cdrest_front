import request from "./request";

const translationService = {
  getAll: (params?: any) =>
    request.get(`/rest/translations/paginate`, { params }),
};

export default translationService;
