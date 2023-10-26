import React from "react";
import { IParcelFeature, Story } from "interfaces";
import Link from "next/link";
import cls from "./parcelFeatureSingle.module.scss";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { useTranslation } from "react-i18next";

const StoryContainer = dynamic(() => import("components/parcelFeatureContainer/parcelFeatureContainer"), {
  ssr: false,
});

type Props = {
  data: IParcelFeature[];
  list: IParcelFeature[][];
};

export default function ParcelFeatureSingle({ data, list }: Props) {
  const [open, handleOpen, handleClose] = useModal();
  const {t} = useTranslation()
  const firstStory = data[0];
  const filteredList = list.filter(
    (item) => item[0]?.id !== firstStory?.id
  );

  const goToStory = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    handleOpen();
  };

  return (
    <>
      {(
        <Link href="/" className={cls.story} onClick={goToStory}>
          <div className={cls.wrapper}>
            <span className={cls.title}>{t(firstStory.title)}</span>
            <FallbackImage
              fill
              src={firstStory.img}
              alt={firstStory.title}
              sizes="130px"
              quality={90}
              priority
            />
          </div>
        </Link>
      )}
      {open && (
        <StoryContainer
          open={open}
          onClose={handleClose}
          stories={[data, ...filteredList]}
        />
      )}
    </>
  );
}