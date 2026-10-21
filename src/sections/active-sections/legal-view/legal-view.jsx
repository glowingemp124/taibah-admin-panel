import { LoadingButton } from '@mui/lab';
import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LoadingScreen } from 'src/components/loading-screen';
import { useAppRole } from 'src/hooks/use-app-role';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const LEGAL_PAGES = {
  terms: {
    title: 'Terms of Service',
    subtitle: 'Please read these terms carefully before using Taibah Marketplace.',
    content: `
      <h2>1. Introduction</h2>
      <p>These Terms of Service govern your use of Taibah Marketplace as a seller. By accessing the seller dashboard, you agree to follow these terms and our related policies.</p>
      <h2>2. Seller Responsibilities</h2>
      <p>You are responsible for the accuracy of product listings, order fulfilment, pricing, and customer communication. Products must match their descriptions, images, and available quantity.</p>
      <h2>3. Orders and Payments</h2>
      <p>Orders placed through the platform are binding once confirmed. Payouts, refunds, and cancellations are processed according to the payment method and order status shown in your dashboard.</p>
      <h2>4. Prohibited Conduct</h2>
      <p>You may not list prohibited items, mislead customers, or use the platform to collect data for unrelated marketing. We may suspend accounts that violate these terms.</p>
      <h2>5. Changes</h2>
      <p>We may update these terms from time to time. Continued use of the seller dashboard after an update means you accept the revised terms.</p>
    `,
  },
  policy: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy is important to us. Please read this privacy policy carefully to understand how we collect, use, and safeguard your information.',
    content: `
      <h2>1. Introduction</h2>
      <p>We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use Taibah Marketplace.</p>
      <h2>2. Information We Collect</h2>
      <p>We may collect the following information:</p>
      <ul>
        <li>Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Account Information</li>
        <li>Usage and Activity Data</li>
      </ul>
      <h2>3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Operate your seller account and store</li>
        <li>Process orders, payouts, and support requests</li>
        <li>Improve the marketplace experience</li>
        <li>Send important service updates</li>
      </ul>
      <h2>4. Data Protection</h2>
      <p>We take reasonable measures to keep your information secure and only share it with service partners needed to run the platform.</p>
    `,
  },
  about: {
    title: 'About Us',
    subtitle: 'Learn more about Taibah Marketplace and how we support sellers.',
    content: `
      <h2>1. Who We Are</h2>
      <p>Taibah Marketplace is a curated Islamic marketplace connecting trusted sellers with customers looking for modest fashion, prayer items, gifts, and more.</p>
      <h2>2. Our Mission</h2>
      <p>We help sellers present their products with care, manage orders clearly, and grow a store that customers can trust.</p>
      <h2>3. For Sellers</h2>
      <p>The seller dashboard is built for day-to-day store work: products, orders, customers, reviews, and store settings in one place.</p>
    `,
  },
};

/**
 * @param {Object} props
 * @param {string} props.type - Type of legal content (e.g., 'about', 'terms', 'privacy')
 */
export default function LegalView({ type }) {
  const theme = useTheme();
  const { isSeller } = useAppRole();
  const page = LEGAL_PAGES[type] || LEGAL_PAGES.terms;
  // const { enqueueSnackbar } = useSnackbar();

  // State for English content
  const [textEn, setTextEn] = useState('');
  const [errorEn, setErrorEn] = useState('');
  const [isUpdatingEn, setIsUpdatingEn] = useState(false);

  // For production: Replace with actual API hooks
  const isLoading = false;
  // const [updateSetting] = useUpdateSettingMutation();
  // const { data, isLoading, refetch } = useGetAdminLegalQuery({ type: type });

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const quillFormats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'align', 'link', 'image', 'video'];

  /**
   * Handle English content change
   * @param {string} value - New content value
   */
  const handleChangeEn = (value) => {
    setTextEn(value);
    if (errorEn) setErrorEn('');
  };

  /**
   * Validate content - checks if content is empty or only contains HTML tags
   * @param {string} content - HTML content to validate
   * @returns {boolean} - True if content is valid
   */
  const validateContent = (content) => {
    if (!content) return false;
    const strippedContent = content.replace(/<[^>]*>/g, '').trim();
    return strippedContent.length > 0;
  };

  /**
   * Handle Save English content
   */
  const handleSaveEnglish = async () => {
    // Validate English content
    if (!validateContent(textEn)) {
      setErrorEn('Please enter English content');
      // enqueueSnackbar('Please enter English content', { variant: 'error' });
      return;
    }

    setIsUpdatingEn(true);

    try {
      const payload = {
        [`${type}_en`]: textEn,
      };

      console.log('Saving English content:', payload);

      // For production: Uncomment and use actual API
      // const response = await updateSetting({ data: payload }).unwrap();
      // enqueueSnackbar('English content updated successfully', { variant: 'success' });
      // refetch(); // Refresh data after update

      // Temporary success simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('English content saved successfully');
      // enqueueSnackbar('English content updated successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error updating English content:', error);
      setErrorEn('Failed to update English content. Please try again.');
      // enqueueSnackbar(error?.data?.message || 'An error occurred while updating English content', { variant: 'error' });
    } finally {
      setIsUpdatingEn(false);
    }
  };

  /**
   * Load data on component mount or type change
   */
  useEffect(() => {
    // For production: Uncomment when API is ready
    // if (data && typeof data === "object") {
    //     setTextEn(data?.[`${type}_en`] ?? "");
    // } else {
    setTextEn(page.content || '');
    // }

    // Clear errors when type changes
    setErrorEn('');
  }, [type, page.content]);

  if (isSeller) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <Typography variant="h4">{page.title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75, mb: 3 }}>
          {page.subtitle}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box
          dangerouslySetInnerHTML={{ __html: page.content }}
          sx={{
            '& h2': { typography: 'subtitle1', mt: 3, mb: 1.25 },
            '& h2:first-of-type': { mt: 0 },
            '& p': { typography: 'body2', mb: 1.5 },
            '& ul': { pl: 3, m: 0, mb: 1.5 },
            '& li': { typography: 'body2', mb: 0.75 },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, display: 'flex', flexDirection: 'column' }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack spacing={4}>
          <Box>
            <StyledPaper
              elevation={3}
              sx={{
                '.ql-toolbar': {
                  backgroundColor: theme?.palette.mode === 'dark' ? '#fff' : '',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                },
                '.ql-container': {
                  minHeight: '300px',
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                },
              }}
            >
              <ReactQuill value={textEn} onChange={handleChangeEn} modules={quillModules} formats={quillFormats} placeholder="" theme="snow" />
            </StyledPaper>

            {errorEn && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorEn}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton onClick={handleSaveEnglish} color="primary" variant="contained" loading={isUpdatingEn} disabled={isUpdatingEn}>
                Save {type === 'about' ? 'About Us' : type === 'terms' ? 'Terms' : type === 'policy' ? 'Privacy Policy' : ''}
              </LoadingButton>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
