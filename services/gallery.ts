import request from "./request";

const galleryService = {
  upload: (data: any) => request.post(`/dashboard/galleries`, data),
};

export default galleryService;
