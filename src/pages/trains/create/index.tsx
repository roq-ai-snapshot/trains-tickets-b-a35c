import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';

import { trainValidationSchema } from 'validationSchema/trains';
import { TrainInterface } from 'interfaces/train';

function TrainCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: TrainInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.train.create({ data: values as any });
      resetForm();
      router.push('/trains');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TrainInterface>({
    initialValues: {
      train_number: '',
      train_name: '',
      origin: '',
      destination: '',
      departure_time: new Date(new Date().toDateString()),
      arrival_time: new Date(new Date().toDateString()),
    },
    validationSchema: trainValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Trains',
              link: '/trains',
            },
            {
              label: 'Create Train',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Train
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.train_number}
            label={'Train Number'}
            props={{
              name: 'train_number',
              placeholder: 'Train Number',
              value: formik.values?.train_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.train_name}
            label={'Train Name'}
            props={{
              name: 'train_name',
              placeholder: 'Train Name',
              value: formik.values?.train_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.origin}
            label={'Origin'}
            props={{
              name: 'origin',
              placeholder: 'Origin',
              value: formik.values?.origin,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.destination}
            label={'Destination'}
            props={{
              name: 'destination',
              placeholder: 'Destination',
              value: formik.values?.destination,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="departure_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Departure Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.departure_time ? new Date(formik.values?.departure_time) : null}
              onChange={(value: Date) => formik.setFieldValue('departure_time', value)}
            />
          </FormControl>
          <FormControl id="arrival_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Arrival Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.arrival_time ? new Date(formik.values?.arrival_time) : null}
              onChange={(value: Date) => formik.setFieldValue('arrival_time', value)}
            />
          </FormControl>

          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/trains')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'train',
    operation: AccessOperationEnum.CREATE,
  }),
)(TrainCreatePage);
