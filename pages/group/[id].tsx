import React from "react";
import { GetServerSideProps } from "next";
import { getCookie } from "utils/session";

export default function ManageGroupOrder() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const shopId = Number(ctx.query.id);
  const groupId = Number(ctx.query.g);
  const ownerId = Number(ctx.query.o);
  const type = String(ctx.query.t);
  const user = getCookie("user", ctx);

  if (user?.id == ownerId) {
    return {
      redirect: {
        destination: `/${type}/${shopId}`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/${type}/${shopId}?g=${groupId}`,
      permanent: false,
    },
  };
};
