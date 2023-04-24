/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      email
      name
      posts {
        id
        title
        content
        createdAt
        published
        author {
          id
          email
          name
        }
        authorId
      }
    }
  }
`
export const createManyUsers = /* GraphQL */ `
  mutation CreateManyUsers($data: [UserCreateManyInput!], $skipDuplicates: Boolean) {
    createManyUsers(data: $data, skipDuplicates: $skipDuplicates) {
      count
    }
  }
`
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $where: UserWhereUniqueInput!
    $data: UserUpdateInput
    $operation: UserOperationInput
  ) {
    updateUser(where: $where, data: $data, operation: $operation) {
      id
      email
      name
      posts {
        id
        title
        content
        createdAt
        published
        author {
          id
          email
          name
        }
        authorId
      }
    }
  }
`
export const updateManyUsers = /* GraphQL */ `
  mutation UpdateManyUsers(
    $where: UserWhereInput!
    $data: UserUpdateInput
    $operation: UserOperationInput
  ) {
    updateManyUsers(where: $where, data: $data, operation: $operation) {
      count
    }
  }
`
export const upsertUser = /* GraphQL */ `
  mutation UpsertUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    upsertUser(data: $data, where: $where) {
      id
      email
      name
      posts {
        id
        title
        content
        createdAt
        published
        author {
          id
          email
          name
        }
        authorId
      }
    }
  }
`
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      id
      email
      name
      posts {
        id
        title
        content
        createdAt
        published
        author {
          id
          email
          name
        }
        authorId
      }
    }
  }
`
export const deleteManyUsers = /* GraphQL */ `
  mutation DeleteManyUsers($where: UserWhereInput!) {
    deleteManyUsers(where: $where) {
      count
    }
  }
`
export const createPost = /* GraphQL */ `
  mutation CreatePost($data: PostCreateInput!) {
    createPost(data: $data) {
      id
      title
      content
      createdAt
      published
      author {
        id
        email
        name
        posts {
          id
          title
          content
          createdAt
          published
          authorId
        }
      }
      authorId
    }
  }
`
export const createManyPosts = /* GraphQL */ `
  mutation CreateManyPosts($data: [PostCreateManyInput!], $skipDuplicates: Boolean) {
    createManyPosts(data: $data, skipDuplicates: $skipDuplicates) {
      count
    }
  }
`
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $where: PostWhereUniqueInput!
    $data: PostUpdateInput
    $operation: PostOperationInput
  ) {
    updatePost(where: $where, data: $data, operation: $operation) {
      id
      title
      content
      createdAt
      published
      author {
        id
        email
        name
        posts {
          id
          title
          content
          createdAt
          published
          authorId
        }
      }
      authorId
    }
  }
`
export const updateManyPosts = /* GraphQL */ `
  mutation UpdateManyPosts(
    $where: PostWhereInput!
    $data: PostUpdateInput
    $operation: PostOperationInput
  ) {
    updateManyPosts(where: $where, data: $data, operation: $operation) {
      count
    }
  }
`
export const upsertPost = /* GraphQL */ `
  mutation UpsertPost($data: PostUpdateInput!, $where: PostWhereUniqueInput!) {
    upsertPost(data: $data, where: $where) {
      id
      title
      content
      createdAt
      published
      author {
        id
        email
        name
        posts {
          id
          title
          content
          createdAt
          published
          authorId
        }
      }
      authorId
    }
  }
`
export const deletePost = /* GraphQL */ `
  mutation DeletePost($where: PostWhereUniqueInput!) {
    deletePost(where: $where) {
      id
      title
      content
      createdAt
      published
      author {
        id
        email
        name
        posts {
          id
          title
          content
          createdAt
          published
          authorId
        }
      }
      authorId
    }
  }
`
export const deleteManyPosts = /* GraphQL */ `
  mutation DeleteManyPosts($where: PostWhereInput!) {
    deleteManyPosts(where: $where) {
      count
    }
  }
`
