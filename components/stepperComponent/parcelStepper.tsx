import React from "react";
import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckDoubleFillIcon from "remixicon-react/CheckDoubleFillIcon";
import SurveyFillIcon from "remixicon-react/SurveyFillIcon";
import TruckFillIcon from "remixicon-react/TruckFillIcon";
import FlagFillIcon from "remixicon-react/FlagFillIcon";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 31,
    "@media (max-width: 576px)": {
      top: 20,
    },
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#83EA00",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#83EA00",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 8,
    border: 0,
    backgroundColor: "var(--secondary-bg)",
    borderRadius: 1,
    "@media (max-width: 576px)": {
      height: 5,
    },
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: "var(--secondary-bg)",
  zIndex: 1,
  color: "#fff",
  width: 70,
  height: 70,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  "@media (max-width: 576px)": {
    width: 44,
    height: 44,
  },
  "& svg": {
    width: 28,
    height: 28,
    fill: "#898989",
    "@media (max-width: 576px)": {
      width: 17,
      height: 17,
    },
  },
  ...(ownerState.active && {
    backgroundColor: "#83EA00",
    "& svg": {
      fill: "#232B2F",
    },
  }),
  ...(ownerState.completed && {
    backgroundColor: "#83EA00",
    "& svg": {
      fill: "#232B2F",
    },
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SurveyFillIcon />,
    2: <CheckDoubleFillIcon />,
    3: <TruckFillIcon />,
    4: <FlagFillIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["accepted", "ready", "on_a_way", "delivered"];

type Props = {
  status: string;
};

const renderActiveStep = (status: string) => {
  switch (status) {
    case "accepted":
      return 0;
    case "ready":
      return 1;
    case "on_a_way":
      return 2;
    case "delivered":
      return 3;

    default:
      return -1;
  }
};

export default function ParcelStepperComponent({ status }: Props) {
  return (
    <Stepper
      alternativeLabel
      activeStep={renderActiveStep(status)}
      connector={<ColorlibConnector />}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
