import React from "react";

type ConditonalWrapperProps = {
  children: any;
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
  otherwise?: (children: JSX.Element) => JSX.Element;
};

export const ConditionalWrapper: React.FC<ConditonalWrapperProps> = ({
  condition,
  wrapper,
  children,
  otherwise,
}) =>
  condition
    ? React.cloneElement(wrapper(children))
    : otherwise
    ? React.cloneElement(otherwise(children))
    : children;
