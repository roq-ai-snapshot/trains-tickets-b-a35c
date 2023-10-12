import * as yup from 'yup';

export const routeValidationSchema = yup.object().shape({
  arrival_time: yup.date().nullable(),
  departure_time: yup.date().nullable(),
  stop_number: yup.number().integer().nullable(),
  train_id: yup.string().nullable().required(),
  station_id: yup.string().nullable().required(),
});
