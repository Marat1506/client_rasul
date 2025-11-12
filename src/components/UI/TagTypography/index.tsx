import React from 'react';

import Typography, { TypographyProps } from '@mui/material/Typography';

const tagToVariant: Record<string, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption' | 'overline' | 'inherit'> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'body1',
};
 
interface TagTypographyProps extends TypographyProps {
    htmlContent: string;
    defaultTag?: string;
}

const TagTypography: React.FC<TagTypographyProps> = ({htmlContent, defaultTag = 'p', ...typographyProps}) => {
    if (!htmlContent) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const element = doc.body.firstChild as HTMLElement;

    const tagName = element ? element.tagName.toLowerCase() : defaultTag;

    const variant = tagToVariant[tagName] || 'body1';
    const content = element ? element.innerHTML : htmlContent;

    return (
        <Typography
            component={tagName}
            variant={variant}
            dangerouslySetInnerHTML={{ __html: content }}
            {...typographyProps}
        />
    );
};

export default TagTypography;
