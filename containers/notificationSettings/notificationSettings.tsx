import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import cls from "./notificationSettings.module.scss";
import SwitchInput from "components/inputs/switchInput";
import { INotification } from "interfaces";
import { useMutation } from "react-query";
import profileService from "services/profile";
import { error } from "components/alert/toast";
import useDidUpdate from "hooks/useDidUpdate";
import { useAuth } from "contexts/auth/auth.context";

type Props = {
  data: INotification[];
};

export default function NotificationSettings({ data }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [values, setValues] = useState<any>(defaultNotifications());

  function defaultNotifications() {
    if (user?.notifications?.length) {
      return user?.notifications?.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: Boolean(cur?.notification?.active),
        }),
        {}
      );
    }
    return data.reduce((acc, cur) => ({ ...acc, [cur.id]: false }), {});
  }

  const { mutate } = useMutation({
    mutationFn: (data: any) => profileService.updateNotifications(data),
    onError: () => {
      error(t("try_again"));
    },
  });

  useDidUpdate(() => {
    const notifications = Object.entries(values).map((item) => ({
      notification_id: item[0],
      active: Number(item[1]),
    }));
    mutate({ notifications });
  }, [values]);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div className={cls.wrapper}>
      <Grid container>
        <Grid item xs={12} md={8}>
          {data.map((item) => (
            <div key={item.id} className={cls.flex}>
              <div className={cls.text}>{t(item.type)}</div>
              <div className={cls.switch}>
                <SwitchInput
                  name={String(item.id)}
                  checked={values[item.id]}
                  onChange={handleChange}
                />
                <div className={cls.value}>
                  {values[item.id] ? t("on") : t("off")}
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
