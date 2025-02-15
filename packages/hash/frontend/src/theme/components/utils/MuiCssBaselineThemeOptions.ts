import { Components } from "@mui/material";

import { customColors } from "../../palette";

const fontFaces = `
  /* INTER */
  @font-face {
    font-family: 'Inter';
    font-weight: 300;
    src: url("/fonts/inter-light.ttf") format("trueType");
  }
  @font-face {
      font-family: 'Inter';
      font-weight: 400;
      src: url("/fonts/inter-regular.ttf") format("trueType");
  }
  @font-face {
      font-family: 'Inter';
      font-weight: 500;
      src: url("/fonts/inter-medium.ttf") format("trueType");
  }
  @font-face {
    font-family: 'Inter';
    font-weight: 600;
    src: url("/fonts/inter-semibold.ttf") format("trueType");
  }
  @font-face {
    font-family: 'Inter';
    font-weight: 700;
    src: url("/fonts/inter-bold.ttf") format("trueType");
  }
  

  /* OPEN SAUCE TWO */
  @font-face {
    font-family: "Open Sauce Two";
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-Light.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: italic;
    font-weight: 300;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-LightItalic.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-Regular.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-Italic.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-Medium.ttf") format("truetype"),
      url("/fonts/OpenSauceTwo-Medium.woff") format("woff");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: italic;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-MediumItalic.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-SemiBold.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: italic;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-SemiBoldItalic.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-Bold.ttf") format("truetype");
  }
  @font-face {
    font-family: "Open Sauce Two";
    font-style: italic;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/OpenSauceTwo-BoldItalic.ttf") format("truetype");
  }
`;

// should be much easier to configure once mui adds support for fluidTypography
//  @see https://github.com/mui-org/material-ui/issues/15251
const rootTypographyStyles = `
  /* @link https://utopia.fyi/type/calculator?c=320,15,1.2,1200,16,1.25,6,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l */
  // 
  :root {
    --fluid-min-width: 320;
    --fluid-max-width: 1200;
  
    --fluid-screen: 100vw;
    --fluid-bp: calc(
      (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
        (var(--fluid-max-width) - var(--fluid-min-width))
    );
  }
  
  @media screen and (min-width: 1200px) {
    :root {
      --fluid-screen: calc(var(--fluid-max-width) * 1px);
    }
  }
  
  :root {
    /* STEP -3 */
    --f--3-min: 12;
    --f--3-max: 12;
    --step--3: calc(
      ((var(--f--3-min) / 16) * 1rem) + (var(--f--3-max) - var(--f--3-min)) *
        var(--fluid-bp)
    );

    /* STEP -2 */
    --f--2-min: 12.8;
    --f--2-max: 13;
    --step--2: calc(
      ((var(--f--2-min) / 16) * 1rem) + (var(--f--2-max) - var(--f--2-min)) *
        var(--fluid-bp)
    );
      
    /* STEP -1 */
    --f--1-min: 13.50;
    --f--1-max: 14;
    --step--1: calc(
      ((var(--f--1-min) / 16) * 1rem) + (var(--f--1-max) - var(--f--1-min)) *
        var(--fluid-bp)
    );
    
    /* STEP 0 */
    --f-0-min: 15.00;
    --f-0-max: 16.00;
    --step-0: calc(
      ((var(--f-0-min) / 16) * 1rem) + (var(--f-0-max) - var(--f-0-min)) *
        var(--fluid-bp)
    );
      
    /* STEP 1 */
    --f-1-min: 18.00;
    --f-1-max: 20.00;
    --step-1: calc(
      ((var(--f-1-min) / 16) * 1rem) + (var(--f-1-max) - var(--f-1-min)) *
        var(--fluid-bp)
    );
      
    /* STEP 2 */
    --f-2-min: 21.60;
    --f-2-max: 25.00;
    --step-2: calc(
      ((var(--f-2-min) / 16) * 1rem) + (var(--f-2-max) - var(--f-2-min)) *
        var(--fluid-bp)
    );
      
    /* STEP 3 */
    --f-3-min: 25.92;
    --f-3-max: 31.25;
    --step-3: calc(
      ((var(--f-3-min) / 16) * 1rem) + (var(--f-3-max) - var(--f-3-min)) *
        var(--fluid-bp)
    );
  
    /* STEP 4 */
    --f-4-min: 31.10;
    --f-4-max: 39.06;
    --step-4: calc(
      ((var(--f-4-min) / 16) * 1rem) + (var(--f-4-max) - var(--f-4-min)) *
        var(--fluid-bp)
    );
      
    /* STEP 5 */
    --f-5-min: 37.32;
    --f-5-max: 48.83;
    --step-5: calc(
      ((var(--f-5-min) / 16) * 1rem) + (var(--f-5-max) - var(--f-5-min)) *
        var(--fluid-bp)
    );
  
    /* STEP 6 */
    --f-6-min: 44.79;
    --f-6-max: 61.04;
    --step-6: calc(
      ((var(--f-6-min) / 16) * 1rem) + (var(--f-6-max) - var(--f-6-min)) *
        var(--fluid-bp)
    );
  }
`;

export const MuiCssBaselineThemeOptions: Components["MuiCssBaseline"] = {
  styleOverrides: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          ${fontFaces}

          html {
            scroll-behavior: smooth;
          }

          #__next {
            height: 100%;
          }

          body {
            overflow: auto;
          }          

          body, p {
            font-size: var(--step-0);
            font-weight: 400;
            line-height: 1.7;
            color: ${customColors.gray["90"]};
          }

          a {
            text-decoration: none;
          }

          ${rootTypographyStyles}
        `,
};
