import React, { useState } from "react";
import SEO from "components/seo";
import AuthContainer from "containers/auth/auth";
import RegisterForm from "components/registerForm/registerForm";
import RegisterDetailsForm from "components/registerDetailsForm/registerDetailsForm";
import OTPVerify from "components/otp-verify/otpVerify";
import SocialLogin from "components/socialLogin/socialLogin";

type Props = {};
type RegisterViews = "REGISTER" | "VERIFY" | "COMPLETE";

export default function Register({}: Props) {
  const [currentView, setCurrentView] = useState<RegisterViews>("REGISTER");
  const [verifyId, setVerifyId] = useState();
  const [email, setEmail] = useState("");
  const [callback, setCallback] = useState(undefined);
  const handleChangeView = (view: RegisterViews) => setCurrentView(view);
  const renderView = () => {
    switch (currentView) {
      case "REGISTER":
        return (
          <RegisterForm
            changeView={handleChangeView}
            onSuccess={({ email, callback }) => {
              setEmail(email);
              setCallback(callback);
            }}
          />
        );
      case "VERIFY":
        return (
          <OTPVerify
            changeView={handleChangeView}
            email={email}
            callback={callback}
            setCallback={setCallback}
          />
        );
      case "COMPLETE":
        return <RegisterDetailsForm email={email} />;
      default:
        return (
          <RegisterForm
            changeView={handleChangeView}
            onSuccess={({ id }) => setVerifyId(id)}
          />
        );
    }
  };
  return (
    <>
      <SEO />
      <AuthContainer>
        {renderView()}
        <SocialLogin />
      </AuthContainer>
    </>
  );
}
