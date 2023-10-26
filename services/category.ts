import { Category, Paginate, SuccessResponse } from "interfaces";
import request from "./request";

const categoryService = {
  getAllShopCategories: (params: any = {}): Promise<Paginate<Category>> =>
    request.get(`/rest/categories/paginate`, {
      params: { ...params, type: "shop" },
    }),
  getAllSubCategories: (
    categoryId: string,
    params: any = {}
  ): Promise<Paginate<Category>> =>
    request.get(`rest/categories/sub-shop/${categoryId}`, { params }),
  getAllProductCategories: (
    id: number,
    params?: any
  ): Promise<Paginate<Category>> =>
    request.get(`/rest/shops/${id}/categories`, { params }),
  getAllRecipeCategories: (params: any = {}): Promise<Paginate<Category>> =>
    request.get(`/rest/categories/paginate`, {
      params: { ...params, type: "receipt" },
    }),
  getById: (id: string, params: any = {}): Promise<SuccessResponse<Category>> =>
    request.get(`/rest/categories/${id}`, { params }),
};

export default categoryService;
