import React from "react";
import cls from "./shopForm.module.scss";
import { Grid } from "@mui/material";
import TextInput from "components/inputs/textInput";
import { ShopFormType } from "interfaces";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import ShopFormTypeTabs from "./shopFormTypeTabs";
import ImageUpload from "components/imageUpload/imageUpload";
import MultiSelect from "components/inputs/multiSelect";

type ListType = {
  label: string;
  value: number;
};

type Props = {
  children?: any;
  lang: string;
  formik: FormikProps<ShopFormType>;
  shopCategories: ListType[];
  tagList: ListType[];
};

export default function ShopGeneralForm({
  formik,
  lang,
  shopCategories,
  tagList,
}: Props) {
  const { t } = useTranslation();
  const {
    title,
    phone,
    images,
    description,
    min_amount,
    tax,
    categories,
    tags,
  } = formik.values;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6} lg={3}>
        <ImageUpload
          formik={formik}
          accept=".png, .jpg, .jpeg, .svg"
          name={"images[0]"}
          label={t("logo.image")}
          value={images[0]}
          error={!!formik.errors.logo && formik.touched.images}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <ImageUpload
          formik={formik}
          name={"images[1]"}
          accept=".png, .jpg, .jpeg, .svg"
          label={t("background.image")}
          value={images[1]}
          error={!!formik.errors.background && formik.touched.images}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <TextInput
          name={`title.${lang}`}
          label={t("title")}
          value={title[lang]}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.title && !!formik.touched.title}
        />
        <div className={cls.spacing} />
        <TextInput
          name="phone"
          label={t("phone")}
          value={phone}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.phone && formik.touched.phone}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name={`description.${lang}`}
          label={t("description")}
          value={description[lang]}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.description && !!formik.touched.description}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <TextInput
          name="min_amount"
          label={t("min_amount")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={min_amount}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.min_amount && formik.touched.min_amount}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <TextInput
          name="tax"
          label={t("tax")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={tax}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.tax && formik.touched.tax}
        />
      </Grid>
      <Grid item xs={12}>
        <MultiSelect
          options={shopCategories}
          name="categories"
          label={t("category")}
          value={categories}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.categories && formik.touched.categories}
        />
      </Grid>
      <Grid item xs={12}>
        <MultiSelect
          options={tagList}
          name="tags"
          label={t("tag")}
          value={tags}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.tags && formik.touched.tags}
        />
      </Grid>
    </Grid>
  );
}
