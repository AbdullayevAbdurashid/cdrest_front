import React from "react";
import SEO from "components/seo";
import ProfileContainer from "containers/profile/profile";
import { useAuth } from "contexts/auth/auth.context";

type Props = {};

export default function Profile({}: Props) {
  const { user } = useAuth();

  return (
    <>
      <SEO />
      <ProfileContainer data={user} />
    </>
  );
}
