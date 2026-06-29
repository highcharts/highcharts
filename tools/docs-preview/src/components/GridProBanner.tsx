import React from 'react';
import { Label } from 'highsoft-ui';

export function GridProBanner(): React.ReactElement {
    return (
        <Label variant="success" iconLeft={false} border className="grid-pro-badge banner">
            Pro feature
        </Label>
    );
}

export default GridProBanner;
