import { Paginate, SuccessResponse } from "interfaces";
import { IRecipe } from "interfaces/recipe.interface";
import request from "./request";

const recipeService = {
  getAll: (params?: any): Promise<Paginate<IRecipe>> =>
    request.get(`/rest/receipts/paginate`, { params }),
  getById: (id: number, params?: any): Promise<SuccessResponse<IRecipe>> =>
    request.get(`/rest/receipts/${id}`, { params }),
};

export default recipeService;
