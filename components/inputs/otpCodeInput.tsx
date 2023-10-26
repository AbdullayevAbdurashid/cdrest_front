import React from "react";
import OtpInput, { OtpInputProps } from "react-otp-input";

export default function OtpCodeInput(props: OtpInputProps) {
  return <OtpInput {...props} inputStyle={{ width: 83, height: 83 }} />;
}
