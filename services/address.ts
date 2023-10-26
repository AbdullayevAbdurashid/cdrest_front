import { Paginate } from "interfaces";
import { AddressCreateData, IAddress } from "interfaces/address.interface";
import request from "./request";

const addressService = {
  create: (data: AddressCreateData) =>
    request.post("dashboard/user/addresses", data).then((res) => res.data),
  update: (id: number, data: AddressCreateData) =>
    request.put(`dashboard/user/addresses/${id}`, data).then((res) => res.data),
  getAll: (params: Record<string, number>) =>
    request.get<IAddress[]>("dashboard/user/addresses", { params }).then((res) => res.data),
  setDefault: (id: number) => request.post(`dashboard/user/address/set-active/${id}`).then(res => res.data),
  delete: (id: number) => request.delete(`dashboard/user/addresses/delete?ids[0]=${id}`).then(res => res.data)
};

export default addressService;
