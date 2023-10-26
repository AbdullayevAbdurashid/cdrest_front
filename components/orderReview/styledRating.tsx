import { Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
  "& .MuiRating-icon": {
    marginRight: "16px",
  },
  "& .MuiRating-iconFilled": {
    color: "var(--orange)",
    "& svg": {
      fill: "var(--orange)",
    },
  },
  "& .MuiRating-iconEmpty": {
    color: "var(--secondary-text)",
    "& svg": {
      fill: "var(--secondary-text)",
    },
  },
  "& .MuiRating-iconHover": {
    color: "var(--orange)",
    "& svg": {
      fill: "var(--orange)",
    },
  },
});

export default StyledRating;
