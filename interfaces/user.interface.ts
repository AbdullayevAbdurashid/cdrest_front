import { IBlog, INotification, IShop, Order, OrderStatus } from "interfaces";
import { IAddress } from "./address.interface";

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  img: string;
  birthday?: string;
  email?: string;
  gender?: string;
  phone?: string;
  role?: string;
  uuid?: string;
  wallet?: IUserWallet;
  notifications?: INotification[];
  shop?: IShop;
  referral_from_topup_count?: number;
  referral_from_topup_price?: number;
  referral_from_withdraw_count?: number;
  referral_from_withdraw_price?: number;
  referral_to_topup_count?: number;
  referral_to_topup_price?: number;
  referral_to_withdraw_count?: number;
  referral_to_withdraw_price?: number;
  my_referral?: string;
  empty_p?: boolean;
  addresses?: IAddress[];
}

export interface LoginCredentials {
  email?: string;
  phone?: number;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstname: string;
  lastname: string;
  password_confirmation: string;
  gender: string;
  referral?: string;
  type?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: IUser;
}

export interface SocialLoginCredentials {
  type: "google" | "facebook" | "apple";
  data: {
    name: string | null;
    email: string | null;
    id: string;
    avatar: string | null;
  };
}

export interface IUserWallet {
  uuid: string;
  price: number;
  symbol: string;
}

export interface VerifyCredentials {
  verifyId?: string;
  verifyCode?: string;
}

export enum NotificationStatus {
  NEW_ORDER = "new_order",
  NEW_USER_BY_REFERRAL = "new_user_by_referral",
  STATUS_CHANGED = "status_changed",
  NEW_IN_TABLE = "new_in_table",
  BOOKING_STATUS = "booking_status",
  NEW_BOOKING = "new_booking",
  NEWS_PUBLISH = "news_publish",
}

export interface IUserPushNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  data?: {
    id: number;
    type: NotificationStatus;
    status: OrderStatus;
  };
  user_id: number;
  created_at: string;
  updated_at: string;
  read_at: any;
  client?: IUser;
  order?: Order;
  blog?: IBlog;
}

export interface IUserPushNotificationStats {
  notification: number;
  transaction: number;
  new_order?: string;
  new_user_by_referral?: string;
  status_changed?: string;
  new_in_table?: string;
  booking_status?: string;
  new_booking?: string;
  news_publish?: string;
}
