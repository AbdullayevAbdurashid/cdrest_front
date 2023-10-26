import { useReducer } from "react";
import { SettingsContext } from "./settings.context";
import { removeCookie, setCookie } from "utils/session";
import { DEFAULT_LOCATION } from "constants/config";

const location = DEFAULT_LOCATION;

enum SettingActionKind {
  UPDATE = "UPDATE_SETTINGS",
  RESET = "RESET_SETTINGS",
  SET_ADDRESS = "SET_ADDRESS",
  SET_LOCATION = "SET_LOCATION",
  SET_LOCATION_ID = "SET_LOCATION_ID",
}

interface SettingAction {
  type: SettingActionKind;
  payload: any;
}

interface SettingState {
  location?: string;
  address?: string;
}

function reducer(state: SettingState, action: SettingAction) {
  const { type, payload } = action;
  switch (type) {
    case SettingActionKind.UPDATE:
      setCookie("settings", JSON.stringify({ ...state, ...payload }));
      return {
        ...state,
        ...payload,
      };
    case SettingActionKind.RESET:
      removeCookie("settings");
      return { location: state.location };
    case SettingActionKind.SET_LOCATION:
      setCookie("settings", JSON.stringify({ ...state, location: payload }));
      return {
        ...state,
        location: payload,
      };
    case SettingActionKind.SET_ADDRESS:
      setCookie("settings", JSON.stringify({ ...state, address: payload }));
      return {
        ...state,
        address: payload,
      };
    case SettingActionKind.SET_LOCATION_ID:
      setCookie("settings", JSON.stringify({ ...state, location_id: payload }));
      return {
        ...state,
        location_id: payload,
      };
    default:
      return state;
  }
}

type Props = {
  children: any;
  settingsState?: SettingState;
  defaultAddress?: string;
};

export function SettingsProvider({
  children,
  settingsState = {},
  defaultAddress,
}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    location,
    address: defaultAddress,
    ...settingsState,
  });

  function updateSettings(data: any = {}) {
    dispatch({ type: SettingActionKind.UPDATE, payload: data });
  }

  function resetSettings() {
    dispatch({ type: SettingActionKind.RESET, payload: null });
  }

  function updateAddress(data: string) {
    if (data) {
      dispatch({ type: SettingActionKind.SET_ADDRESS, payload: data });
    }
  }

  function updateLocation(data: string) {
    dispatch({ type: SettingActionKind.SET_LOCATION, payload: data });
  }

  function updateLocationId(data: string) {
    dispatch({ type: SettingActionKind.SET_LOCATION_ID, payload: data });
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: state,
        updateSettings,
        resetSettings,
        address: state?.address,
        updateAddress,
        location: state?.location,
        updateLocation,
        updateLocationId,
        location_id: state.location_id
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
