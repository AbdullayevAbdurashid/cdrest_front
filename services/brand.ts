import { IBrand, Paginate } from "interfaces";
import request from "./request";

const brandService = {
    getAll: (params: any):Promise<Paginate<IBrand>> => request.get('/rest/brands/paginate', {params})
}

export default brandService;