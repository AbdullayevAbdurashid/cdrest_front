import request from "./request";

const walletService = {
  getAll: (params?: any) =>
    request.get(`/dashboard/user/wallet/histories`, { params }),
};

export default walletService;
