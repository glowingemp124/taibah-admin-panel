import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { fData } from 'src/utils/format-number';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  displayName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod.string().email({ message: 'Email must be a valid email address!' }).optional().or(zod.literal('')),
  photoURL: schemaHelper
    .file({ message: { required_error: 'Avatar is required!' } })
    .nullable()
    .optional(),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
});

export function AccountGeneral() {
  const { user } = useMockedUser();

  const defaultValues = {
    displayName: user?.displayName || user?.basicInfo?.name || '',
    email: user?.email || user?.basicInfo?.email || '',
    photoURL: user?.photoURL || user?.basicInfo?.profileIcon || null,
    phoneNumber: user?.phoneNumber || user?.basicInfo?.phone || '',
    country: user?.country || user?.basicInfo?.country || '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              pt: 5,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <Field.Switch name="isPublic" labelPlacement="start" label="Public profile" sx={{ mt: 5 }} />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete user
            </Button> */}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="displayName" label="Name" />
              <Field.Text name="email" label="Email address" disabled />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <Field.Text name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
