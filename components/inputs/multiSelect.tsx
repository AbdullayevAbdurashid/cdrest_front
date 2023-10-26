import {
  Box,
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { Fragment, ReactNode } from "react";

const Label = styled(InputLabel)({
  fontSize: 12,
  lineHeight: "14px",
  fontWeight: 500,
  textTransform: "uppercase",
  color: "var(--black)",
  "&.Mui-focused": {
    color: "var(--black)",
  },
  "&.Mui-error": {
    color: "var(--red)",
  },
});

const SelectMenu = styled(Select)({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "19px",
  color: "var(--black)",
  fontFamily: "'Inter', sans-serif",
  "&::before": {
    borderBottom: "1px solid var(--grey)",
  },
  "&:hover:not(.Mui-disabled)::before": {
    borderBottom: "2px solid var(--black)",
  },
  "&::after": {
    borderBottom: "2px solid var(--primary)",
  },
  "&.Mui-error::after": {
    borderBottomColor: "var(--red)",
  },
});

const SelectMenuItem = styled(MenuItem)({
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: "var(--grey)",
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      boxShadow: "var(--popover-box-shadow)",
      borderRadius: 10,
      border: "1px solid var(--grey)",
      backgroundColor: "var(--secondary-bg)",
    },
  },
};

interface ListType {
  label: string;
  value: number;
  parent?: ListType;
}

interface Props extends SelectProps {
  options: ListType[];
}

const renderOptions = (options: ListType[]) =>
  options.map((option) => (
    <SelectMenuItem key={option.value} value={option.value} sx={{pl: option.parent ? 4 : 2}} disableRipple>
      {option.label}
    </SelectMenuItem>
  ));

export default function MultiSelect({ options, ...props }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Label variant="standard" shrink={true} error={props.error}>
        {props.label}
      </Label>
      <SelectMenu
        multiple
        input={<Input id="category" placeholder={t("choose.here")} fullWidth />} //@ts-expect-error
        renderValue={(selected: number[]): ReactNode => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={options.find((el) => el.value == value)?.label}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        {...props}
      >
        {renderOptions(options)}
      </SelectMenu>
    </>
  );
}
