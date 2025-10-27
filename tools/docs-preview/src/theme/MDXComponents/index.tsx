import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import GridProBadge from '../../components/GridProBadge';
import GridProBanner from '../../components/GridProBanner';
import CodeSwitchable from '../../components/CodeSwitchable';

export default {
    ...MDXComponents,
    'grid-pro-badge': GridProBadge,
    'grid-pro-banner': GridProBanner,
    'CodeSwitchable': CodeSwitchable
};
