import { Paginate, Product, SuccessResponse } from "interfaces";
import request from "./request";

const productService = {
  getAll: (params?: any): Promise<Paginate<Product>> =>
    request.get(`/rest/products/paginate`, { params }),
  getAllShopProducts: (id: number, params?: any) =>
    request.get(`/rest/shops/${id}/products`, { params }),
  getById: (uuid: string, params?: any): Promise<SuccessResponse<Product>> =>
    request.get(`/rest/products/${uuid}`, { params }),
  search: (params: any): Promise<Paginate<Product>> =>
    request.get(`/rest/products/search`, { params }),
  getShopProductsPaginate: (id: number, params?: any) =>
    request.get(`/rest/shops/${id}/products/paginate`, { params }),
  getShopProductsRecommended: (id: number, params?: any) =>
    request.get(`/rest/shops/${id}/products/recommended/paginate`, { params }),
};

export default productService;
