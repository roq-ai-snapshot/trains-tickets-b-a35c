import * as yup from 'yup';

export const trainValidationSchema = yup.object().shape({
  train_number: yup.string().nullable(),
  train_name: yup.string().nullable(),
  origin: yup.string().nullable(),
  destination: yup.string().nullable(),
  departure_time: yup.date().nullable(),
  arrival_time: yup.date().nullable(),
});
