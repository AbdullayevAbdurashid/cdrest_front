export default function handleGooglePlacesPress(result: any) {
  const map: any = {
    street_number: "streetNumber",
    route: "streetName",
    sublocality_level_1: "city",
    locality: "city1",
    administrative_area_level_1: "state",
    postal_code: "postalCode",
    country: "country",
  };
  const brokenDownAddress: any = {};
  result.address_components.forEach((component: any) => {
    brokenDownAddress[map[component.types[0]]] = component.long_name;
  });
  const concatedAddress = [
    brokenDownAddress?.streetName,
    brokenDownAddress?.city1,
    brokenDownAddress?.country,
  ];
  return concatedAddress.join(", ");
}
