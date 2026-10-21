import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useDispatch } from 'react-redux';

import { useAppRole } from 'src/hooks/use-app-role';
import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';
import { saveSellerProfile } from 'src/sections/auth/jwt/seller-signup';
import { setUser } from 'src/store/slices/userSlice';

const StoreSchema = zod.object({
  name: zod.string().min(1, { message: 'Store name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  logo: zod.string().optional(),
});

export function StoreSettingsView() {
  const dispatch = useDispatch();
  const { companyId, user } = useAppRole();
  const company = MOCK_COMPANIES.find((row) => row._id === companyId) || MOCK_COMPANIES[0];
  const sellerProfile = user?.sellerProfile;

  const defaultValues = useMemo(
    () => ({
      name: sellerProfile?.storeName || company?.name || '',
      description: sellerProfile?.storeDescription || company?.description || '',
      logo: company?.logo || '',
    }),
    [company, sellerProfile]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(StoreSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateMockCompany(company._id, {
      name: data.name,
      description: data.description,
      logo: data.logo || company.logo,
    });

    if (sellerProfile) {
      const profile = saveSellerProfile({
        ...sellerProfile,
        storeName: data.name,
        storeDescription: data.description,
      });
      dispatch(setUser({ ...user, sellerProfile: profile }));
    }

    toast.success('Store settings saved!');
  });

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs
        heading="Store Settings"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Store Settings' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: { xs: 2.5, md: 3 }, maxWidth: 720 }}>
          <Stack spacing={3}>
            <Field.Text name="name" label="Store name" />
            <Field.Text name="description" label="Description" multiline rows={4} />
            <Field.Text name="logo" label="Logo URL" />
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>
    </Box>
  );
}
