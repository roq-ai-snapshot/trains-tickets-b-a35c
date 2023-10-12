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

import { routeValidationSchema } from 'validationSchema/routes';
import { TrainInterface } from 'interfaces/train';
import { StationInterface } from 'interfaces/station';
import { RouteInterface } from 'interfaces/route';

function RouteCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: RouteInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.route.create({ data: values as any });
      resetForm();
      router.push('/routes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RouteInterface>({
    initialValues: {
      arrival_time: new Date(new Date().toDateString()),
      departure_time: new Date(new Date().toDateString()),
      stop_number: 0,
      train_id: (router.query.train_id as string) ?? null,
      station_id: (router.query.station_id as string) ?? null,
    },
    validationSchema: routeValidationSchema,
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
              label: 'Routes',
              link: '/routes',
            },
            {
              label: 'Create Route',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Route
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="arrival_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Arrival Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.arrival_time ? new Date(formik.values?.arrival_time) : null}
              onChange={(value: Date) => formik.setFieldValue('arrival_time', value)}
            />
          </FormControl>
          <FormControl id="departure_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Departure Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.departure_time ? new Date(formik.values?.departure_time) : null}
              onChange={(value: Date) => formik.setFieldValue('departure_time', value)}
            />
          </FormControl>

          <NumberInput
            label="Stop Number"
            formControlProps={{
              id: 'stop_number',
              isInvalid: !!formik.errors?.stop_number,
            }}
            name="stop_number"
            error={formik.errors?.stop_number}
            value={formik.values?.stop_number}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('stop_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<TrainInterface>
            formik={formik}
            name={'train_id'}
            label={'Select Train'}
            placeholder={'Select Train'}
            fetcher={() => roqClient.train.findManyWithCount({})}
            labelField={'train_number'}
          />
          <AsyncSelect<StationInterface>
            formik={formik}
            name={'station_id'}
            label={'Select Station'}
            placeholder={'Select Station'}
            fetcher={() => roqClient.station.findManyWithCount({})}
            labelField={'station_name'}
          />
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
              onClick={() => router.push('/routes')}
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
    entity: 'route',
    operation: AccessOperationEnum.CREATE,
  }),
)(RouteCreatePage);
