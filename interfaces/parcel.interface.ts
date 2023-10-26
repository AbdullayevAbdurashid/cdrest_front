import { Currency, ITransaction, Location, OrderReview, Translation } from "interfaces";
import { IUser } from "./user.interface";

export interface Parcel {
  id: number;
  user_id: number;
  rate: number;
  note?: string;
  status: string;
  address_from?: ParcelAddress;
  address_to?: ParcelAddress;
  delivery_date: string;
  delivery_time: string;
  phone_from: string;
  username_from: string;
  phone_to: string;
  username_to: string;
  current: boolean;
  img?: string;
  created_at: string;
  updated_at: string;
  currency?: Currency;
  user?: IUser;
  transaction?: ITransaction;
  deliveryman?: IUser;
  type?: ParcelType;
  total_price?: number;
  review: OrderReview | null;
}

export interface ParcelAddress {
  latitude: string;
  longitude: string;
  address: string;
  house?: string;
  stage?: string;
  room?: string;
}

export interface ParcelOption {
  id: number;
  translation?: Translation;
}

export interface ParcelType {
  id: number;
  type: string;
  img?: string;
  min_width: number;
  min_height: number;
  min_length: number;
  max_width: number;
  max_height: number;
  max_length: number;
  min_g: number;
  max_g: number;
  price: number;
  price_per_km: number;
  created_at: string;
  updated_at: string;
  options: ParcelOption[];
}

export interface ParcelFormValues {
  currency_id: number;
  type_id: string;
  rate: number;
  phone_from: string;
  username_from: string;
  address_from: string;
  location_from: Location;
  house_from: string;
  stage_from: string;
  room_from: string;
  phone_to: string;
  username_to: string;
  address_to: string;
  location_to: Location;
  house_to: string;
  stage_to: string;
  room_to: string;
  delivery_date: string;
  delivery_time: string;
  note: string;
  images: string[];
  payment_type_id?: number;
  notify?: boolean;
  instructions: string;
  description: string;
  qr_value: string
}
