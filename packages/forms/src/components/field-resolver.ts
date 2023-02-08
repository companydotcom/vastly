import { FieldProps } from "./field"

/**
 * Get value from a deeply nested object using a string path.
 * Memorizes the value.
 * @param obj - the object
 * @param path - the string path
 * @param fallback  - the fallback value
 */
export function get(
  obj: Record<string, any>,
  path: string | number,
  fallback?: any,
  index?: number,
) {
  const key = typeof path === "string" ? path.split(".") : [path]

  for (index = 0; index < key.length; index += 1) {
    if (!obj) break
    obj = obj[key[index]]
  }

  return obj === undefined ? fallback : obj
}

export type FieldResolver = {
  getFields(): FieldProps[]
  getNestedFields(name: string): FieldProps[]
}

interface SchemaField extends FieldProps {
  items?: SchemaField[]
  properties?: Record<string, SchemaField>
}

export type ObjectSchema = Record<string, SchemaField>

const mapFields = (schema: ObjectSchema): FieldProps[] =>
  schema &&
  Object.entries(schema).map(([name, { items, label, title, ...field }]) => {
    return {
      ...field,
      name,
      label: label || title || name, // json schema compatibility
    }
  })

export const objectFieldResolver = (schema: ObjectSchema): FieldResolver => {
  const getFields = () => {
    return mapFields(schema)
  }
  const getNestedFields = (name: string) => {
    const field = get(schema, name)

    if (!field) return []

    if (field.items?.type === "object") {
      return mapFields(field.items.properties)
    } else if (field.type === "object") {
      return mapFields(field.properties)
    }
    return [field.items]
  }

  return { getFields, getNestedFields }
}
