/**
 * @todo update from blockprotocol
 */
declare module "@mui/material/styles" {
  interface Palette {
    white: string;
    black: string;
    purple: {
      600: string;
    };
    blue: {
      700: string;
    };
    yellow: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    orange: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    gray: {
      10: string;
      20: string;
      30: string;
      40: string;
      50: string;
      60: string;
      70: string;
      80: string;
      90: string;
    };
    grey: undefined;
  }

  interface TypographyVariants {
    bpTitle: React.CSSProperties;
    bpSubtitle: React.CSSProperties;
    bpHeading1: React.CSSProperties;
    bpHeading2: React.CSSProperties;
    bpHeading3: React.CSSProperties;
    bpHeading4: React.CSSProperties;
    bpLargeText: React.CSSProperties;
    bpBodyCopy: React.CSSProperties;
    bpSmallCopy: React.CSSProperties;
    bpMicroCopy: React.CSSProperties;
    hashLargeTitle: React.CSSProperties;
    hashHeading1: React.CSSProperties;
    hashHeading4: React.CSSProperties;
    hashBodyCopy: React.CSSProperties;
    hashSmallText: React.CSSProperties;
    hashSmallTextMedium: React.CSSProperties;
    hashSmallCaps: React.CSSProperties;
    hashFooterHeading: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    bpTitle?: React.CSSProperties;
    bpSubtitle?: React.CSSProperties;
    bpHeading1?: React.CSSProperties;
    bpHeading2?: React.CSSProperties;
    bpHeading3?: React.CSSProperties;
    bpHeading4?: React.CSSProperties;
    bpSmallCaps?: React.CSSProperties;
    bpLargeText?: React.CSSProperties;
    bpBodyCopy?: React.CSSProperties;
    bpSmallCopy?: React.CSSProperties;
    bpMicroCopy?: React.CSSProperties;
    hashLargeTitle?: React.CSSProperties;
    hashHeading1?: React.CSSProperties;
    hashHeading4?: React.CSSProperties;
    hashBodyCopy?: React.CSSProperties;
    hashSmallText?: React.CSSProperties;
    hashSmallTextMedium?: React.CSSProperties;
    hashSmallCaps?: React.CSSProperties;
    hashFooterHeading?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bpTitle: true;
    bpSubtitle: true;
    bpHeading1: true;
    bpHeading2: true;
    bpHeading3: true;
    bpHeading4: true;
    bpSmallCaps: true;
    bpLargeText: true;
    bpBodyCopy: true;
    bpSmallCopy: true;
    bpMicroCopy: true;

    hashLargeTitle: true;
    hashHeading1: true;
    hashHeading4: true;
    hashBodyCopy: true;
    hashSmallText: true;
    hashSmallTextMedium: true;
    hashFooterHeading: true;
    hashSmallCaps: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    primarySquare: true;
    secondary: true;
    tertiary: true;
    // Disable defaults
    contained: false;
    outlined: false;
    text: false;
  }

  interface ButtonPropsColorOverrides {
    default: true;
    // Disable defaults
    primary: false;
    secondary: false;
    success: false;
    error: false;
    info: false;
    warning: false;
  }

  interface ButtonPropsSizeOverrides {
    small: false;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    yellow: true;
  }
}

// https://github.com/mui-org/material-ui/issues/28244
export default "";
