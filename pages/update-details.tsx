import React from "react";
import SEO from "components/seo";
import AuthContainer from "containers/auth/auth";
import RegisterDetailsForm from "components/registerDetailsForm/registerDetailsForm";

type Props = {};

export default function UpdateDetails({}: Props) {
  return (
    <>
      <SEO />
      <AuthContainer>
        <RegisterDetailsForm />
      </AuthContainer>
    </>
  );
}
