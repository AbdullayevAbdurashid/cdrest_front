import React from "react";
import { IUser } from "interfaces/user.interface";
import cls from "./profileCard.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LogoutCircleRLineIcon from "remixicon-react/LogoutCircleRLineIcon";
import { useRouter } from "next/router";
import { useAuth } from "contexts/auth/auth.context";
import Avatar from "components/avatar";

type Props = {
  data: IUser;
  handleClose: () => void;
};

export default function ProfileCard({ data, handleClose }: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    handleClose();
    push("/login");
  };

  return (
    <div className={cls.wrapper}>
      <Link href={"/profile"} className={cls.profile}>
        <div className={cls.naming}>
          <label>
            {data.firstname} {data.lastname?.charAt(0)}.
          </label>
          <span className={cls.link}>{t("view.profile")}</span>
        </div>
        <div className={cls.profileImage}>
          <Avatar data={data} />
        </div>
      </Link>
      <button className={cls.logoutBtn} onClick={handleLogout}>
        <LogoutCircleRLineIcon />
      </button>
    </div>
  );
}
