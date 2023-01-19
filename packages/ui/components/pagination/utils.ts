export function defaultGetAriaLabel(type: string, page: number, selected: boolean) {
  if (type === "page") {
    return `${selected ? "" : "Go to "}page ${page}`;
  }
  return `Go to ${type} page`;
}
