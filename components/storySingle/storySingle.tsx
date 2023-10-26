import React from "react";
import { Story } from "interfaces";
import Link from "next/link";
import cls from "./storySingle.module.scss";
import useModal from "hooks/useModal";
import getImage from "utils/getImage";
import dynamic from "next/dynamic";
import getStoryImage from "utils/getStoryImage";
import FallbackImage from "components/fallbackImage/fallbackImage";

const StoryContainer = dynamic(() => import("containers/story/story"), {
  ssr: false,
});

type Props = {
  data: Story[];
  list: Story[][];
};

export default function StorySingle({ data, list }: Props) {
  const [open, handleOpen, handleClose] = useModal();
  const firstStory = data[0];
  const filteredList = list.filter(
    (item) => item[0]?.shop_id !== firstStory?.shop_id
  );

  const goToStory = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    handleOpen();
  };

  return (
    <>
      {!!firstStory && (
        <Link href="/" className={cls.story} onClick={goToStory}>
          <div className={cls.wrapper}>
            <span className={cls.title}>{firstStory.product_title}</span>
            <FallbackImage
              fill
              src={getStoryImage(firstStory.url)}
              alt={firstStory.product_title}
              sizes="130px"
              quality={90}
              priority
            />
          </div>
          <div className={cls.logo}>
            <span className={cls.logoWrapper}>
              <FallbackImage
                fill
                src={getImage(firstStory.logo_img)}
                alt={firstStory.title}
                sizes="38px"
                quality={90}
                priority
              />
            </span>
          </div>
          <h3 className={cls.shopTitle}>{firstStory.title}</h3>
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
