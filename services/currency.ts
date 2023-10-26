import { Currency, Paginate } from "interfaces";
import request from "./request";

const currencyService = {
  getAll: (params?: any): Promise<Paginate<Currency>> =>
    request.get(`/rest/currencies/active`, { params }),
};

export default currencyService;
