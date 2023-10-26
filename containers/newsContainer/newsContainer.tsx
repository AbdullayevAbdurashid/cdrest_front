import React from "react";
import { useMediaQuery } from "@mui/material";
import useLocale from "hooks/useLocale";
import { useQuery } from "react-query";
import blogService from "services/blog";
import { useRouter } from "next/router";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import NewsContent from "./newsContent";

type Props = {};

export default function NewsContainer({}: Props) {
  const isMobile = useMediaQuery("(max-width:576px)");
  const { locale } = useLocale();
  const { query, replace } = useRouter();
  const blogId = String(query.news || "");

  const { data, isLoading } = useQuery(
    ["news", locale, blogId],
    () => blogService.getNewsById(blogId),
    {
      enabled: Boolean(blogId),
    }
  );

  const handleClose = () => {
    replace(
      {
        pathname: "",
        query: JSON.parse(
          JSON.stringify({
            ...query,
            news: undefined,
          })
        ),
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <div>
      {!isMobile ? (
        <ModalContainer open={!!blogId} onClose={handleClose}>
          <NewsContent
            data={data?.data}
            loading={isLoading}
            handleClose={handleClose}
          />
        </ModalContainer>
      ) : (
        <MobileDrawer open={!!blogId} onClose={handleClose}>
          <NewsContent
            data={data?.data}
            loading={isLoading}
            handleClose={handleClose}
          />
        </MobileDrawer>
      )}
    </div>
  );
}
