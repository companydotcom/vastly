/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($where: UserWhereUniqueInput!) {
    getUser(where: $where) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers($where: UserWhereInput, $orderBy: [UserOrderByInput], $skip: Int, $take: Int) {
    listUsers(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
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
export const countUsers = /* GraphQL */ `
  query CountUsers($where: UserWhereInput, $orderBy: [UserOrderByInput], $skip: Int, $take: Int) {
    countUsers(where: $where, orderBy: $orderBy, skip: $skip, take: $take)
  }
`
export const getPost = /* GraphQL */ `
  query GetPost($where: PostWhereUniqueInput!) {
    getPost(where: $where) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts($where: PostWhereInput, $orderBy: [PostOrderByInput], $skip: Int, $take: Int) {
    listPosts(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
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
export const countPosts = /* GraphQL */ `
  query CountPosts($where: PostWhereInput, $orderBy: [PostOrderByInput], $skip: Int, $take: Int) {
    countPosts(where: $where, orderBy: $orderBy, skip: $skip, take: $take)
  }
`
