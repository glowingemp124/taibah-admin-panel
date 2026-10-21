import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import MuiStepper from '@mui/material/Stepper';

import { Iconify } from 'src/components/iconify';

export function SellerSignupStepper({ steps, activeStep, onStepClick }) {
  return (
    <MuiStepper nonLinear activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
      {steps.map((label, index) => (
        <Step key={label} completed={index < activeStep}>
          <StepButton
            type="button"
            onClick={() => onStepClick?.(index)}
            sx={{
              '& .MuiStepLabel-label': {
                typography: 'caption',
                fontWeight: index === activeStep ? 700 : 500,
              },
            }}
            icon={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  color: 'text.disabled',
                  typography: 'subtitle2',
                  bgcolor: 'action.disabledBackground',
                  ...(index === activeStep && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                  ...(index < activeStep && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                }}
              >
                {index < activeStep ? <Iconify width={14} icon="mingcute:check-fill" /> : index + 1}
              </Box>
            }
          >
            {label}
          </StepButton>
        </Step>
      ))}
    </MuiStepper>
  );
}
