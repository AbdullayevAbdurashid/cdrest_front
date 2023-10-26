import React, { useEffect, useReducer } from "react";
import { setCookie } from "utils/session";
import { DirType, ThemeContext, ThemeType } from "./theme.context";

enum ThemeActionKind {
  TOGGLE_THEME = "TOGGLE_THEME",
  SET_DIRECTION = "SET_DIRECTION",
}

interface ThemeAction {
  type: ThemeActionKind;
  payload?: any;
}
interface StateType {
  theme: ThemeType;
  direction: DirType;
}

function reducer(state: StateType, action: ThemeAction) {
  const { type, payload } = action;
  switch (type) {
    case ThemeActionKind.TOGGLE_THEME:
      const changedTheme: ThemeType = state.theme === "dark" ? "light" : "dark";
      setCookie("theme", changedTheme);
      return {
        ...state,
        theme: changedTheme,
      };
    case ThemeActionKind.SET_DIRECTION:
      setCookie("dir", payload);
      return {
        ...state,
        direction: payload,
      };
    default:
      return state;
  }
}

type Props = {
  children: any;
  appTheme: ThemeType;
  appDirection: DirType;
};

export default function ThemeProvider({
  children,
  appTheme,
  appDirection,
}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    theme: appTheme,
    direction: appDirection,
  });

  const toggleDarkMode = () => {
    dispatch({ type: ThemeActionKind.TOGGLE_THEME });
  };

  const setDirection = (payload: DirType) => {
    dispatch({ type: ThemeActionKind.SET_DIRECTION, payload });
  };

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", state.theme);
    body.setAttribute("dir", state.direction);
  }, [state]);

  return (
    <ThemeContext.Provider
      value={{
        direction: state.direction,
        theme: state.theme,
        toggleDarkMode,
        setDirection,
        isDarkMode: state.theme === "dark",
      }}
    >
      <div className="App" data-theme={state.theme} dir={state.direction}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
