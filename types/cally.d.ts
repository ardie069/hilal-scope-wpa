import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          min?: string;
          max?: string;
          locale?: string;
        },
        HTMLElement
      >;
      "calendar-month": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          offset?: number;
        },
        HTMLElement
      >;
      "calendar-range": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
        },
        HTMLElement
      >;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": any;
      "calendar-month": any;
      "calendar-range": any;
    }
  }
}

