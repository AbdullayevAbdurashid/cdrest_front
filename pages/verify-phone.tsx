import React from "react";
import SEO from "components/seo";
import AuthContainer from "containers/auth/auth";
import VerifyCodeForm from "components/verifyCodeForm/verifyCodeForm";

type Props = {};

export default function Verify({}: Props) {
  return (
    <>
      <SEO />
      <AuthContainer>
        <VerifyCodeForm />
      </AuthContainer>
    </>
  );
}
