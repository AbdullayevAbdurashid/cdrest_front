import React from "react";
import SEO from "components/seo";
import AuthContainer from "containers/auth/auth";
import UpdatePasswordForm from "components/updatePasswordForm/updatePasswordForm";

type Props = {};

export default function Register({}: Props) {
  return (
    <>
      <SEO />
      <AuthContainer>
        <UpdatePasswordForm />
      </AuthContainer>
    </>
  );
}
