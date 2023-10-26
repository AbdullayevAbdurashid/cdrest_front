import request from "./request";

const informationService = {
  getSettings: (params?: any) => request.get(`/rest/settings`, { params }),
  getReferrals: (params?: any) => request.get(`/rest/referral`, { params }),
};

export default informationService;
