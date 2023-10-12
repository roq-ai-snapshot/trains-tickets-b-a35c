import * as yup from 'yup';

export const stationValidationSchema = yup.object().shape({
  station_name: yup.string().nullable(),
  station_code: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  country: yup.string().nullable(),
});
