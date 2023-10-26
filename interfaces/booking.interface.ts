import {
  ShopWorkingDays,
  Translation,
  ShopClosedDate,
  IShopTranslation,
  Location,
  IShop,
} from "interfaces";
import { IUser } from "./user.interface";

export interface ITable {
  id: number;
  name: string;
  shop_section_id: number;
  tax: number;
  chair_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  shop_section: IShopSection;
}

export interface IShopSection {
  id: number;
  shop_id: number;
  area: string;
  img: string;
  created_at: string;
  updated_at: string;
  translation: Translation;
}

export interface IBookingSchedule {
  id: number;
  translation: IShopTranslation;
  logo_img?: string;
  background_img?: string;
  uuid?: string;
  location?: Location;
  booking_shop_closed_date?: ShopClosedDate[];
  booking_shop_working_days?: ShopWorkingDays[];
  phone?: string;
  rating_avg?: number;
  reviews_count?: number;
  is_recommended?: boolean;
  open: boolean;
}

export interface IBookingDisabledDate {
  end_date: string;
  start_date: string;
}

export interface IBookingZone {
  id: number;
  shop_id: number;
  area: string;
  img: string;
  created_at: string;
  updated_at: string;
  shop?: IShop;
  translation?: Translation;
}

export interface IBookingMaxTime {
  id: number;
  max_time: number;
  shop?: IShop;
}

export interface IBooking {
  id: number;
  booking_id: number;
  user_id: number;
  table_id: number;
  start_date: string;
  status: string;
  booking: IBookingMaxTime;
  user: IUser;
  table: ITable;
}
