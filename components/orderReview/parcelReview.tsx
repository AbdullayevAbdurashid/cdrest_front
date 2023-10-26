import React from "react";
import cls from "./orderReview.module.scss";
import { useTranslation } from "react-i18next";
import TextInput from "components/inputs/textInput";
import PrimaryButton from "components/button/primaryButton";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import StyledRating from "./styledRating";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { success, error } from "components/alert/toast";
import parcelService from "services/parcel";

type Props = {
  handleClose: () => void;
  refetch: () => void;
};

type FormValues = {
  rating: number;
  comment?: string;
};

export default function ParcelReview({ handleClose, refetch }: Props) {
  const { t } = useTranslation();
  const { query } = useRouter();
  const orderId = Number(query.id);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => parcelService.review(orderId, data),
    onSuccess: () => {
      refetch();
      handleClose();
      success(t("thanks.for.feedback"));
    },
    onError: () => {
      error(t("request.not.sent"));
    },
  });

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: "",
    },
    onSubmit: (values: FormValues) => {
      console.log("values => ", values);
      const body: FormValues = {
        rating: values.rating,
        comment: values.comment || undefined,
      };
      if (body.rating > 0) {
        mutate(body);
      }
    },
    validate: (values: FormValues) => {
      const errors = {} as FormValues;
      return errors;
    },
  });

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h2 className={cls.title}>{t("leave.feedback")}</h2>
      </div>
      <div className={cls.body}>
        <div className={cls.rating}>
          <StyledRating
            name="rating"
            value={formik.values.rating}
            onChange={formik.handleChange}
            icon={<StarSmileFillIcon fontSize="inherit" size={42} />}
            emptyIcon={<StarSmileFillIcon fontSize="inherit" size={42} />}
          />
        </div>
        <TextInput
          id="comment"
          name="comment"
          label={t("comment")}
          value={formik.values.comment}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
        />
      </div>
      <div className={cls.footer}>
        <div className={cls.btnWrapper}>
          <PrimaryButton type="submit" loading={isLoading}>
            {t("submit")}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
