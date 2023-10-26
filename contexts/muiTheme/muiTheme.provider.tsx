import React from "react";
import mediaQuery from "css-mediaquery";
import { createTheme, ThemeProvider } from "@mui/material";

type Props = {
  children: any;
  deviceType: any;
};

export default function MuiThemeProvider({
  children,
  deviceType: { mobile, tablet, desktop },
}: Props) {
  const ssrMatchMedia = (query: any) => ({
    matches: mediaQuery.match(query, {
      width: mobile ? "360px" : tablet ? "768px" : "1140px",
    }),
  });

  const theme = createTheme({
    components: {
      MuiUseMediaQuery: {
        defaultProps: {
          ssrMatchMedia,
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
