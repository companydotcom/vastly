import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Post = {
  __typename?: "Post"
  createdAt: Scalars["Date"]
  id: Scalars["ID"]
  title: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  users: Array<User>
}

export type User = {
  __typename?: "User"
  email: Scalars["String"]
  id: Scalars["ID"]
  name: Scalars["String"]
  posts: Array<Post>
}

export type UsersQueryVariables = Exact<{ [key: string]: never }>

export type UsersQuery = {
  __typename?: "Query"
  users: Array<{
    __typename?: "User"
    name: string
    posts: Array<{ __typename?: "Post"; title: string }>
  }>
}

export const UsersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Users" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "posts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "title" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>
