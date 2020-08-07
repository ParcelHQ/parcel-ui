import { css } from '@emotion/core';

export const GlobalStyle = css`
  @import url('https://rsms.me/inter/inter.css');
  html {
    font-family: 'Inter', monospace;
  }
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Inter var', monospace;
    }
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-width: 480px;
    height: 100%;
    position: relative;
  }
`;
