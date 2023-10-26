import React from "react";
import cls from "./reservation.module.scss";
import useLocale from "hooks/useLocale";
import { Grid, Rating, useMediaQuery } from "@mui/material";
import RcDatePicker from "components/pickers/rcDatePicker";
import { useFormik } from "formik";
import ReservationTimes from "components/reservationTimes/reservationTimes";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import RcSelect from "components/pickers/rcSelect";
import OutlinedInput from "components/inputs/outlinedInput";
import { useQuery } from "react-query";
import bookingService from "services/booking";
import Loader from "components/loader/loader";
import { IBookingSchedule } from "interfaces/booking.interface";
import { IShop } from "interfaces";
import RcZonePicker from "components/pickers/rcZonePicker";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import ModalContainer from "containers/modal/modal";

const AsyncRestaurantListForm = dynamic(
  () => import("components/restaurantListForm/asyncRestaurantListForm")
);

type Props = {
  data?: IBookingSchedule;
};

interface formValues {
  date?: string;
  zone_id?: string;
  table_id?: string;
  number_of_people?: number;
}

export default function Reservation({ data }: Props) {
  const { t, locale } = useLocale();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { query, replace } = useRouter();
  const date_from = String(query.date_from || "") || undefined;
  const date_to = String(query.date_to || "") || undefined;
  const table_id = String(query.table_id || "") || undefined;
  const zone_id = String(query.zone_id || "") || undefined;
  const number_of_people = Number(query.guests) || 0;
  const shop_id = Number(query.id) || 0;
  const [branchModal, handleOpenBranchModal, handleCloseBranchModal] =
    useModal();

  const { data: zones, isLoading: isZoneLoading } = useQuery(
    ["zones", locale, shop_id],
    () => bookingService.getZones({ page: 1, perPage: 100, shop_id: shop_id }),
    {
      select: (data) =>
        data.data.map((item) => ({
          label: item.translation?.title || "",
          value: String(item.id),
          data: item,
        })),
    }
  );

  const { data: tables, isLoading } = useQuery(
    ["tables", locale, zone_id],
    () =>
      bookingService.getTables({
        page: 1,
        perPage: 100,
        shop_section_id: zone_id,
      }),
    {
      staleTime: 0,
      select: (data) =>
        data.data.map((item) => ({
          label: item.name,
          value: String(item.id),
        })),
      onSuccess: (data) => {
        if (data.length) {
          updateSchedule({ table_id: data[0].value });
        }
      },
    }
  );

  const { data: disabledDates, isLoading: isDatesLoading } = useQuery(
    ["disabledDates", table_id, date_from, date_to],
    () =>
      bookingService.disabledDates(Number(table_id), {
        date_from: date_from ? `${date_from}` : undefined,
        date_to: date_to
          ? `${date_to}`
          : date_from
          ? `${date_from}`
          : undefined,
      }),
    { enabled: Boolean(table_id) }
  );

  const formik = useFormik({
    initialValues: {
      date: date_from ? dayjs(date_from).format("YYYY-MM-DD") : undefined,
      table_id,
      zone_id,
      number_of_people,
    },
    enableReinitialize: true,
    onSubmit: (values: formValues, { setSubmitting }) => {
      console.log("values => ", values);
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.date) {
        errors.date = t("required");
      }
      if (!values.table_id) {
        errors.table_id = t("required");
      }
      if (!values.zone_id) {
        errors.zone_id = t("required");
      }
      if (!values.number_of_people) {
        errors.number_of_people = t("required");
      }
      if (!!values.number_of_people && values.number_of_people < 1) {
        errors.number_of_people = t("should.be.more.than.0");
      }
      return errors;
    },
  });

  function updateSchedule(params: any) {
    replace(
      {
        query: {
          ...query,
          ...params,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  const handleSubmit = (selectedValue: string) => {
    if (!selectedValue) {
      return;
    }
    handleCloseBranchModal();
    replace({
      pathname: `/reservations/${selectedValue}`,
      query: {
        ...query,
        zone_id: undefined,
        table_id: undefined,
      },
    });
  };

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <header className={cls.header}>
          <div className={cls.rating}>
            <ShopLogoBackground data={data as IShop} size="large" />
          </div>
          <h1 className={cls.title}>{data?.translation.title}</h1>
          <p className={cls.text}>
            {data?.translation.address}{" "}
            <a
              href="#change-branch"
              className={cls.link}
              onClick={handleOpenBranchModal}
            >
              {t("change.restaurant")}
            </a>
          </p>
          <div className={cls.rating}>
            <Rating
              value={data?.rating_avg}
              readOnly
              sx={{ color: "#ffa100", "& *": { color: "inherit" } }}
            />
            <p className={cls.text}>
              {t("number.of.reviews", { count: data?.reviews_count || 0 })}
            </p>
          </div>
        </header>
        {!isLoading && !isZoneLoading ? (
          <form className={cls.form} onSubmit={formik.handleSubmit}>
            <Grid container spacing={isDesktop ? 4 : 2}>
              <Grid item xs={12} sm={6} md={3}>
                <RcDatePicker
                  name="date"
                  label={t("date")}
                  value={formik.values.date}
                  onChange={(event: any) => {
                    updateSchedule({
                      date_from: dayjs(event).format("YYYY-MM-DD"),
                      date_to: dayjs(event).format("YYYY-MM-DD"),
                    });
                  }}
                  error={!!formik.errors.date}
                />
              </Grid>
              {!!zones?.length && (
                <Grid item xs={12} sm={6} md={3}>
                  <RcZonePicker
                    name="zone_id"
                    label={t("zone")}
                    value={formik.values.zone_id}
                    onChange={(event: any) => {
                      updateSchedule({ zone_id: event.target.value });
                    }}
                    options={zones}
                    error={!!formik.errors.zone_id}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3}>
                <RcSelect
                  name="table_id"
                  label={t("table")}
                  value={formik.values.table_id}
                  onChange={(event: any) => {
                    updateSchedule({ table_id: event.target.value });
                  }}
                  options={tables}
                  error={!!formik.errors.table_id}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedInput
                  label={t("guests")}
                  name="number_of_people"
                  type="number"
                  value={formik.values.number_of_people}
                  onChange={formik.handleChange}
                  onBlur={(event: any) => {
                    !formik.errors?.number_of_people &&
                      updateSchedule({ guests: event.target.value });
                  }}
                  error={!!formik.errors.number_of_people}
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </form>
        ) : (
          <Loader />
        )}
        {!isDatesLoading ? (
          <div>
            {!isLoading && !isZoneLoading && (
              <ReservationTimes
                data={data}
                disabledDates={disabledDates}
                validateForm={formik.validateForm}
              />
            )}
          </div>
        ) : (
          <div className={cls.loadingBox}>
            <Loader />
          </div>
        )}
      </div>
      <ModalContainer open={branchModal} onClose={handleCloseBranchModal}>
        <div className={cls.modalWrapper}>
          <h1 className={cls.title}>{t("restaurants")}</h1>
          <AsyncRestaurantListForm
            branchId={data?.id}
            handleSubmit={handleSubmit}
          />
        </div>
      </ModalContainer>
    </div>
  );
}
