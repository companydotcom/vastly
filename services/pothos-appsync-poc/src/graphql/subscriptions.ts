/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatedUser = /* GraphQL */ `
  subscription OnCreatedUser($id: Int, $email: AWSEmail) {
    onCreatedUser(id: $id, email: $email) {
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
export const onUpdatedUser = /* GraphQL */ `
  subscription OnUpdatedUser($id: Int, $email: AWSEmail) {
    onUpdatedUser(id: $id, email: $email) {
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
export const onUpsertedUser = /* GraphQL */ `
  subscription OnUpsertedUser($id: Int, $email: AWSEmail) {
    onUpsertedUser(id: $id, email: $email) {
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
export const onDeletedUser = /* GraphQL */ `
  subscription OnDeletedUser($id: Int, $email: AWSEmail) {
    onDeletedUser(id: $id, email: $email) {
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
export const onMutatedUser = /* GraphQL */ `
  subscription OnMutatedUser($id: Int, $email: AWSEmail) {
    onMutatedUser(id: $id, email: $email) {
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
export const onCreatedManyUsers = /* GraphQL */ `
  subscription OnCreatedManyUsers {
    onCreatedManyUsers {
      count
    }
  }
`
export const onUpdatedManyUsers = /* GraphQL */ `
  subscription OnUpdatedManyUsers {
    onUpdatedManyUsers {
      count
    }
  }
`
export const onMutatedManyUsers = /* GraphQL */ `
  subscription OnMutatedManyUsers {
    onMutatedManyUsers {
      count
    }
  }
`
export const onDeletedManyUsers = /* GraphQL */ `
  subscription OnDeletedManyUsers {
    onDeletedManyUsers {
      count
    }
  }
`
export const onCreatedPost = /* GraphQL */ `
  subscription OnCreatedPost($id: Int) {
    onCreatedPost(id: $id) {
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
export const onUpdatedPost = /* GraphQL */ `
  subscription OnUpdatedPost($id: Int) {
    onUpdatedPost(id: $id) {
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
export const onUpsertedPost = /* GraphQL */ `
  subscription OnUpsertedPost($id: Int) {
    onUpsertedPost(id: $id) {
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
export const onDeletedPost = /* GraphQL */ `
  subscription OnDeletedPost($id: Int) {
    onDeletedPost(id: $id) {
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
export const onMutatedPost = /* GraphQL */ `
  subscription OnMutatedPost($id: Int) {
    onMutatedPost(id: $id) {
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
export const onCreatedManyPosts = /* GraphQL */ `
  subscription OnCreatedManyPosts {
    onCreatedManyPosts {
      count
    }
  }
`
export const onUpdatedManyPosts = /* GraphQL */ `
  subscription OnUpdatedManyPosts {
    onUpdatedManyPosts {
      count
    }
  }
`
export const onMutatedManyPosts = /* GraphQL */ `
  subscription OnMutatedManyPosts {
    onMutatedManyPosts {
      count
    }
  }
`
export const onDeletedManyPosts = /* GraphQL */ `
  subscription OnDeletedManyPosts {
    onDeletedManyPosts {
      count
    }
  }
`
