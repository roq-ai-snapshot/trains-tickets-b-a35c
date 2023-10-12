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
  Center,
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
import { FunctionComponent, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { useRoqClient, useRouteFindFirst } from 'lib/roq';
import { convertQueryToPrismaUtil } from 'lib/utils';
import { routeValidationSchema } from 'validationSchema/routes';
import { RouteInterface } from 'interfaces/route';
import { TrainInterface } from 'interfaces/train';
import { StationInterface } from 'interfaces/station';

function RouteEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const roqClient = useRoqClient();
  const queryParams = useMemo(
    () =>
      convertQueryToPrismaUtil(
        {
          id,
        },
        'route',
      ),
    [id],
  );
  const { data, error, isLoading, mutate } = useRouteFindFirst(queryParams, {}, { disabled: !id });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RouteInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await roqClient.route.update({
        data: values as any,
        where: {
          id,
        },
      });
      mutate(updated);
      resetForm();
      router.push('/routes');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<RouteInterface>({
    initialValues: data,
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
              label: 'Update Route',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Route
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(RouteEditPage);
