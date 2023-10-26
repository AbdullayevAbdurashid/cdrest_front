import { Story } from "interfaces";
import request from "./request";

const storyService = {
  getAll: (params?: any): Promise<Story[][]> =>
    request.get(`/rest/stories/paginate`, { params }),
};

export default storyService;
