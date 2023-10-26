import { IUser } from "./user.interface";

export interface Product {
  id: number;
  uuid?: string;
  category?: Category;
  category_id?: number;
  img: string;
  shop_id?: number;
  galleries?: Gallery[];
  translation: Translation;
  stocks?: Stock[];
  stock?: Stock;
  min_qty?: number;
  max_qty?: number;
  shop?: IShop;
  interval: number;
  unit: Unit;
}

export interface ShopReview {
  id: number;
  reviewable_id: number;
  reviewable_type: string;
  assignable_id: number;
  assignable_type: string;
  rating: number;
  comment: string;
  img: any;
  created_at: string;
  updated_at: string;
  user?: IUser;
  order?: Order;
}

export interface Translation {
  locale: string;
  title: string;
  description: string;
}

export interface Stock {
  id: number;
  price: number;
  quantity: number;
  extras?: ProductExtra[];
  bonus?: Bonus;
  addons?: Addon[];
  discount?: number;
  total_price?: number;
  product?: Product;
  tax?: number;
}

export interface ProductExtra {
  extra_group_id: number;
  id: number;
  value: string;
  group: ExtraGroup;
}

export interface ExtraGroup {
  id: number;
  type: string;
  translation: Translation;
}

export interface IShopTranslation extends Translation {
  address?: string;
}

export interface IShop {
  id: number;
  translation: IShopTranslation;
  logo_img?: string;
  background_img?: string;
  mark?: string;
  uuid?: string;
  products_count?: number;
  delivery_time?: ShopDeliveryTime;
  location?: Location;
  shop_closed_date?: ShopClosedDate[];
  shop_working_days?: ShopWorkingDays[];
  bonus?: Bonus;
  price: number;
  price_per_km?: number;
  phone?: string;
  shop_payments?: ShopPayment[];
  rating_avg?: number;
  is_recommended?: boolean;
  discounts_count?: number;
  type?: "restaurant" | "shop";
  discount?: any;
  reviews_count?: number;
  tags?: IShopTag[];
  open: boolean;
  verify: Number;
  min_amount?: number
}

export interface IBookingShop {
  id: number;
  translation: IShopTranslation;
  logo_img?: string;
  background_img?: string;
  mark?: string;
  uuid?: string;
  products_count?: number;
  delivery_time?: ShopDeliveryTime;
  location?: Location;
  booking_shop_closed_date?: ShopClosedDate[];
  booking_shop_working_days?: ShopWorkingDays[];
  bonus?: Bonus;
  price: number;
  price_per_km?: number;
  phone?: string;
  shop_payments?: ShopPayment[];
  rating_avg?: number;
  is_recommended?: boolean;
  discounts_count?: number;
  type?: "restaurant" | "shop";
  discount?: any;
  reviews_count?: number;
  tags?: IShopTag[];
  open: boolean;
  verify: Number;
}

export interface Bonus {
  bonus_quantity: number;
  type: "sum" | "count";
  value: number;
  bonusStock: CartStock;
}

export interface ShopDeliveryTime {
  to: string;
  from: string;
  type: string;
}

export interface ShopClosedDate {
  id: number;
  day: string;
}
export interface ShopWorkingDays {
  id: number;
  day: string;
  from: string;
  to: string;
  disabled?: boolean;
}

export interface Location {
  latitude: string;
  longitude: string;
}

export interface Category {
  id: number;
  translation: Translation;
  uuid?: string;
  children?: Category[];
  img?: string;
  input: number;
}

export interface CategoryWithProducts extends Omit<Category, "children"> {
  products: Product[];
  children: CategoryWithProducts[];
}

export interface Gallery {
  url: string;
}

export interface CartType {
  currency_id?: number;
  id: number;
  owner_id?: number;
  rate?: number;
  group?: boolean;
  shop_id: number;
  total_price: number;
  user_carts: UserCart[];
  receipt_count?: number;
  receipt_discount?: number;
}

export interface UserCart {
  cart_id?: number;
  id: number;
  name: string;
  status?: boolean;
  user_id: number;
  uuid: string;
  cartDetails: CartStockWithProducts[];
}

export interface CartProduct extends Product {
  quantity: number;
  stock: Stock;
  extras: string[];
  addons: CartProduct[];
}

export interface CartStockWithProducts {
  bonus?: boolean;
  id?: number;
  price: number;
  quantity: number;
  stock: CartStock;
  addons?: CartStockWithProducts[];
  discount?: number;
  unit: Unit;
}

export interface CartStock extends Stock {
  product: Product;
  total_price?: number;
}

export interface Coupon {
  id?: number;
  code?: string;
  discountInPercent?: number;
}

export interface Story {
  shop_id: number;
  logo_img: string;
  title: string;
  product_uuid: string;
  product_title: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  shop_id: number;
  url: string;
  img: string;
  active: boolean;
  clickable: boolean | number;
  type: string;
  likes: number;
  created_at: string;
  updated_at: string;
  translation: Translation;
}

export enum OrderStatus {
  NEW = "new",
  ACCEPTED = "accepted",
  READY = "ready",
  ON_A_WAY = "on_a_way",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export interface Order {
  id: number;
  total_price: number;
  total_discount: number;
  created_at: string;
  shop: IShop;
  status: OrderStatus;
  details: OrderDetailsType[];
  address?: IAddress;
  currency?: Currency;
  delivery_date?: string;
  delivery_time?: string;
  delivery_type?: string;
  delivery_fee?: number;
  location?: Location;
  deliveryman?: IUser;
  tax?: number;
  updated_at: string;
  order_refunds?: Refund[];
  rate?: number;
  transaction?: ITransaction;
  coupon?: OrderCoupon;
  review?: OrderReview;
  origin_price?: number;
  service_fee?: number;
}

export interface OrderReview {
  id: number;
  reviewable_id: number;
  rating: number;
  comment?: any;
  img?: any;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailsType {
  bonus?: boolean;
  id?: number;
  total_price: number;
  quantity: number;
  stock: OrderStock;
  addons: OrderDetailsType[];
  discount: number;
}

export interface OrderStock extends Stock {
  product: Product;
}

export interface Langauge {
  active: number;
  backward: number;
  default: number;
  id: number;
  locale: string;
  title: string;
}

export interface Currency {
  active: boolean;
  default: boolean;
  id: number;
  rate: number;
  symbol: string;
  title: string;
  position: "after" | "before";
}

export interface OrderFormValues {
  coupon?: string;
  location: Location;
  address?: IAddress;
  delivery_date?: string;
  delivery_time?: string;
  delivery_type?: "delivery" | "pickup";
  note?: string;
  office?: string;
  house?: string;
  floor?: string;
  payment_type?: Payment;
  shop_id?: number;
  username?: string;
  phone?: string;
  for_someone?: boolean;
  notes: any;
}

export interface ShopPayment {
  id: number;
  shop_id: number;
  payment: Payment;
}

export interface Payment {
  id: number;
  tag: string;
}

export interface Refund {
  answer?: string;
  cause?: string;
  id: number;
  order: Order;
  status?: "pending" | "approved" | "canceled";
  created_at?: string;
  updated_at?: string;
}

interface FaqTranslation {
  id: number;
  locale: string;
  question: string;
  answer: string;
}

export interface Faq {
  id: number;
  uuid: string;
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  translation: FaqTranslation;
}

export interface Addon {
  id?: number;
  product?: Product;
  stock_id?: number;
}

export interface INotification {
  id: number;
  type: string;
  notification?: IUserNotification;
}

export interface IUserNotification {
  user_id: number;
  notification_id: number;
  active: number;
}

export interface IWallet {
  id: number;
  uuid: string;
  wallet_uuid: string;
  transaction_id: number;
  type: string;
  price: number;
  note: string;
  status: string;
  created_at: string;
  updated_at: string;
  author: IUser;
  user: IUser;
}

export interface IPushNotification {
  title?: string;
  body?: string;
}

export interface IChat {
  id?: number;
  user: IUser;
  shop_id?: number;
  roleId?: string;
}

export interface IMessage {
  id: any;
  chat_content: string;
  chat_id: number;
  sender: number;
  unread: boolean;
  created_at: string;
  status: string;
  chat_img: string;
  roleId: string;
}

export interface IAddress {
  address: string;
  office?: string;
  house?: string;
  floor?: string;
}

export interface ShopFormType {
  price?: number;
  price_per_km?: number;
  title?: any;
  categories: string[];
  phone?: string;
  description?: any;
  min_amount?: number;
  tax?: number;
  delivery_time_type?: string;
  delivery_time_from?: number;
  delivery_time_to?: number;
  address?: any;
  images: [string, string];
  user_id?: number;
  location?: string;
  type: "restaurant" | "shop";
  logo?: string;
  background?: string;
  tags: string[];
}

export interface ITransaction {
  id: number;
  payable_id: number;
  price: number;
  note: string;
  status: string;
  created_at: string;
  updated_at: string;
  payment_system: Payment;
}

export interface IBrand {
  id: number;
  title: string;
  img: string;
  products_count: number;
}

export interface IBlogTranslation extends Translation {
  short_desc: string;
}

export interface IBlog {
  id?: number;
  uuid?: string;
  img?: string;
  translation?: IBlogTranslation;
  created_at?: string;
  updated_at?: string;
}

export interface Referral {
  id?: number;
  img?: string;
  translation?: Translation;
  created_at?: string;
  updated_at?: string;
  price_from: number;
  price_to: number;
}

export interface IShopTag {
  id: number;
  img?: string;
  translation: Translation;
}

export interface IBranch {
  id: number;
  address: IAddress;
  location: Location;
  created_at: string;
  updated_at: string;
  shop: IShop;
  translation: Translation;
  locales: string[];
}

export interface OrderCoupon {
  id: number;
  name?: string;
  price: number;
}

export interface Paginate<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    links: {
      active: boolean;
      label: string;
      url: string;
    }[];
    per_page: string;
    to: number;
    total: number;
  };
}

export interface SuccessResponse<T> {
  data: T;
  message: string;
  status: boolean;
  timestamp: string;
}

export interface IPrivacy {
  id: number;
  translation: Translation;
}

export interface IPage {
  id: number;
  img?: string;
  type: string;
  translation?: Translation;
  buttons?: {
    app_store_button_link: string;
    google_play_button_link: string;
  };
}

export interface IParcelFeature {
  img: string;
  title: string;
  id: number;
}

export interface Unit {
  translation?: Translation;
}

export interface InsertProductBody {
  shop_id: number;
  currency_id?: number;
  rate?: number;
  products: {
    stock_id: number;
    quantity: number;
    parent_id?: number;
  }[];
}

export interface MemberInsertProductBody extends InsertProductBody {
  cart_id: number;
  user_cart_uuid?: string;
}

export interface NotificationData {
  id: number;
  status?: string;
  type?: string;
}
