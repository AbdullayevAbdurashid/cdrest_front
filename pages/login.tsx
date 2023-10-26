import React from "react";
import SEO from "components/seo";
import AuthContainer from "containers/auth/auth";
import LoginForm from "components/loginForm/loginForm";
import SocialLogin from "components/socialLogin/socialLogin";

type Props = {};

export default function Login({}: Props) {
  return (
    <>
      <SEO />
      <AuthContainer>
        <LoginForm />
        <SocialLogin />
      </AuthContainer>
    </>
  );
}
