import * as React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps, styled } from '@mui/material';

interface CustomGridProps extends MuiGridProps {
  item?: boolean;
  container?: boolean;
}

const CustomGrid = styled(MuiGrid, {
  shouldForwardProp: (prop) => prop !== 'item' && prop !== 'container',
})<CustomGridProps>(({ theme }) => ({
  // Add any custom styles here if needed
}));

export default CustomGrid;
