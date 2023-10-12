import * as yup from 'yup';

export const ticketValidationSchema = yup.object().shape({
  booking_date: yup.date().nullable(),
  journey_date: yup.date().nullable(),
  seat_number: yup.number().integer().nullable(),
  status: yup.string().nullable(),
  train_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
