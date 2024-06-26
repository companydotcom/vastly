import * as React from "react";

/**
 * Get the first child of a specific type.
 * @param children The children
 * @param type The component type
 */
export function getChildOfType(children: React.ReactNode, type: React.JSXElementConstructor<any>) {
  return (React.Children.toArray(children) as React.ReactElement[]).find(
    (item) => item.type === type,
  );
}

/**
 * Get all children of a specific type.
 * @param children The children
 * @param type The component type
 */
export function getChildrenOfType(
  children: React.ReactNode,
  type: React.JSXElementConstructor<any> | React.JSXElementConstructor<any>[],
) {
  return (React.Children.toArray(children) as React.ReactElement[]).filter((item) =>
    Array.isArray(type) ? type.some((component) => component === item.type) : item.type === type,
  );
}
