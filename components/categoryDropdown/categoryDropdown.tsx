import React from "react";
import { PopoverProps } from "@mui/material";
import PopoverContainer from "containers/popover/popover";
import cls from "./categoryDropdown.module.scss";
import { Category } from "interfaces";

interface Props extends PopoverProps {
  data: Category[];
  handleClickItem?: (event?: any, id?: number) => void;
}

export default function CategoryPopover({
  data,
  handleClickItem = () => {},
  ...props
}: Props) {
  const handleClick = (event: any, id: number) => {
    if (props.onClose) props.onClose({}, "backdropClick");
    handleClickItem(event, id);
  };

  return (
    <PopoverContainer
      {...props}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className={cls.wrapper}>
        {data.map((item) => (
          <a
            href={`#${item.uuid}`}
            key={item.uuid}
            className={cls.link}
            onClick={(event) => handleClick(event, item.id)}
          >
            <span className={cls.text}>{item.translation.title}</span>
          </a>
        ))}
      </div>
    </PopoverContainer>
  );
}
