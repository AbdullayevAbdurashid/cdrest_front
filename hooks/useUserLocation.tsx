import { useMemo } from "react";
import { useSettings } from "contexts/settings/settings.context";
import { Location } from "interfaces";

export default function useUserLocation() {
  const { location: userLocation } = useSettings();

  const location: Location | undefined = useMemo(() => {
    const latlng = userLocation;
    if (!latlng) {
      return undefined;
    }
    return {
      latitude: latlng.split(",")[0],
      longitude: latlng.split(",")[1],
    };
  }, [userLocation]);

  return location;
}
