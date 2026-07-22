import React from 'react';
import { Label } from 'highsoft-ui';

export function GridProBadge(): React.ReactElement {
    return (
        <Label variant="success" iconLeft={false} border className="grid-pro-badge">
            Pro
        </Label>
    );
}

export default GridProBadge;
