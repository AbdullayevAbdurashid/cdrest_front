import { Paginate, IShop, SuccessResponse, ShopReview, IBookingShop } from "interfaces";
import request from "./request";

const shopService = {
  getAll: (params: string): Promise<Paginate<IShop>> =>
    request.get(`/rest/shops/paginate?${params}`),
  getAllBooking: (params: string): Promise<Paginate<IShop>> =>
    request.get(`/rest/booking/shops/paginate?${params}`),
  getAllRestaurants: (params: string): Promise<Paginate<IBookingShop>> =>
    request.get(`/rest/shops/paginate?type=restaurant&${params}`),
  getAllShops: (params: string): Promise<Paginate<IShop>> =>
    request.get(`/rest/shops/paginate?type=shop&${params}`),
  getById: (id: number, params?: any): Promise<SuccessResponse<IShop>> =>
    request.get(`/rest/shops/${id}`, { params }),
  getRecommended: (params?: any): Promise<Paginate<IShop>> =>
    request.get(`/rest/shops/recommended`, { params }),
  search: (params: any): Promise<Paginate<IShop>> =>
    request.get(`/rest/shops/search`, { params }),
  getAllTags: (params?: any) => request.get(`/rest/shops-takes`, { params }),
  getAveragePrices: (params?: any) =>
    request.get(`/rest/products-avg-prices`, { params }),
  create: (data: any) => request.post(`/dashboard/user/shops`, data),
  checkZone: (params?: any) =>
    request.get(`/rest/shop/delivery-zone/check/distance`, { params }),
  checkZoneById: (id: number, params?: any) =>
    request.get(`/rest/shop/${id}/delivery-zone/check/distance`, { params }),
  getByIdReviews: (id: number, params?: any): Promise<Paginate<ShopReview>> =>
    request.get(`/rest/shops/${id}/reviews`, { params }),
};

export default shopService;
