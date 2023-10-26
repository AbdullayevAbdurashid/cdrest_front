import { toast, ToastOptions } from "react-toastify";
import CheckboxCircleLineIcon from "remixicon-react/CheckboxCircleLineIcon";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import InformationLineIcon from "remixicon-react/InformationLineIcon";
import Alert from "./alert";

export const success = (msg: string, options?: ToastOptions) => {
  toast(
    <Alert icon={<CheckboxCircleLineIcon />} message={msg} type="success" />,
    options
  );
};
export const warning = (msg: string, options?: ToastOptions) => {
  toast(
    <Alert icon={<ErrorWarningLineIcon />} message={msg} type="warning" />,
    options
  );
};
export const error = (msg: string, options?: ToastOptions) => {
  toast(
    <Alert icon={<ErrorWarningLineIcon />} message={msg} type="error" />,
    options
  );
};
export const info = (msg: string, options?: ToastOptions) => {
  toast(
    <Alert icon={<InformationLineIcon />} message={msg} type="info" />,
    options
  );
};
