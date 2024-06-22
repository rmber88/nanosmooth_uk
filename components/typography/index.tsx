import { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";

export type TypographyProps = {
  children: React.ReactNode | string;
  textShadow?: boolean;
} & HTMLAttributes<HTMLHeadingElement>;

export type TypographyTextProps = {
  children: React.ReactNode | string;
  isGrey?: boolean;
  textShadow?: boolean;
  as?: ElementType;
} & HTMLAttributes<HTMLParagraphElement>;

const headingStyles = {
  1: tw`text-[2rem] lg:(text-[3rem] leading-[3.5rem]) `,
  2: tw`text-2xl  lg:(text-[2.5rem] leading-[3rem]) `,
  3: tw`text-[1.5rem] font-medium leading-tight lg:(text-[2rem]) `,
  4: tw`text-[1.1rem] lg:(text-[1.5rem]) `,
};

const Typo = styled.h1(
  tw`font-semibold`,
  ({ level }: { level: keyof typeof headingStyles }) => [
    tw`text-black-100 font-bold dark:(text-white-100)`,
    headingStyles[level],
  ]
);

const H1 = ({ children, ...otherProps }: TypographyProps) => (
  <Typo as="h1" level={1} {...otherProps}>
    {children}
  </Typo>
);

const H2 = ({ children, ...otherProps }: TypographyProps) => (
  <Typo as="h2" level={2} {...otherProps}>
    {children}
  </Typo>
);

const H3 = ({ children, ...otherProps }: TypographyProps) => (
  <Typo as="h3" level={3} {...otherProps}>
    {children}
  </Typo>
);

const H4 = ({ children, ...otherProps }: TypographyProps) => (
  <Typo as="h4" level={4} {...otherProps}>
    {children}
  </Typo>
);

const P = ({ children, isGrey, ...otherProps }: TypographyTextProps) => {
  return isGrey ? (
    <p
      tw="text-gray-300 font-light text-sm  dark:(text-gray-300)"
      {...otherProps}
    >
      {children}
    </p>
  ) : (
    <p
      tw="dark:(text-white-100) font-light text-sm text-black-100"
      {...otherProps}
    >
      {children}
    </p>
  );
};

export default function Typography() {
  return <h1></h1>;
}

Typography.H1 = H1;
Typography.H2 = H2;
Typography.H3 = H3;
Typography.H4 = H4;
Typography.P = P;
