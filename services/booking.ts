import { Paginate, SuccessResponse } from "interfaces";
import request from "./request";
import {
  IBooking,
  IBookingDisabledDate,
  IBookingMaxTime,
  IBookingSchedule,
  IBookingZone,
  ITable,
} from "interfaces/booking.interface";

const bookingService = {
  getAll: (params?: any): Promise<Paginate<IBookingMaxTime>> =>
    request.get(`/rest/booking/bookings`, { params }),
  disabledDates: (id: number, params: any): Promise<IBookingDisabledDate[]> =>
    request.get(`/rest/booking/disable-dates/table/${id}`, { params }),
  create: (data: any) => request.post(`/dashboard/user/my-bookings`, data),
  getTables: (params: any): Promise<Paginate<ITable>> =>
    request.get(`/rest/booking/tables`, { params }),
  getZones: (params: any): Promise<Paginate<IBookingZone>> =>
    request.get(`/rest/booking/shop-sections`, { params }),
  getZoneById: (
    id: number,
    params?: any
  ): Promise<SuccessResponse<IBookingZone>> =>
    request.get(`/rest/booking/shop-sections/${id}`, { params }),
  getBookingSchedule: (
    id: number,
    params?: any
  ): Promise<SuccessResponse<IBookingSchedule>> =>
    request.get(`/rest/booking/shops/${id}`, { params }),
  getBookingHistory: (params?: any): Promise<Paginate<IBooking>> =>
    request.get(`/dashboard/user/my-bookings`, { params }),
};

export default bookingService;
