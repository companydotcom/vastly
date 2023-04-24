/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UserCreateInput = {
  id?: number | null
  email: string
  name: string
  posts?: UserPostsCreateRelationInput | null
}

export type UserPostsCreateRelationInput = {
  create?: Array<PostCreateInput | null> | null
  connect?: Array<PostWhereUniqueInput | null> | null
  connectOrCreate?: Array<PostConnectOrCreateInput | null> | null
}

export type PostCreateInput = {
  id?: number | null
  title: string
  content?: string | null
  createdAt?: string | null
  published: boolean
  author: PostAuthorCreateRelationInput
}

export type PostAuthorCreateRelationInput = {
  create?: UserCreateInput | null
  connect?: UserWhereUniqueInput | null
  connectOrCreate?: UserConnectOrCreateInput | null
}

export type UserWhereUniqueInput = {
  id?: number | null
  email?: string | null
}

export type UserConnectOrCreateInput = {
  where: UserWhereUniqueInput
  create: UserCreateInput
}

export type PostWhereUniqueInput = {
  id?: number | null
}

export type PostConnectOrCreateInput = {
  where: PostWhereUniqueInput
  create: PostCreateInput
}

export type User = {
  __typename: "User"
  id: number
  email: string
  name: string
  posts?: Array<Post | null> | null
}

export type Post = {
  __typename: "Post"
  id: number
  title: string
  content?: string | null
  createdAt: string
  published: boolean
  author: User
  authorId: number
}

export type UserCreateManyInput = {
  id?: number | null
  email: string
  name: string
}

export type BatchPayload = {
  __typename: "BatchPayload"
  count?: number | null
}

export type UserUpdateInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  posts?: UserPostsUpdateRelationsInput | null
}

export type UserPostsUpdateRelationsInput = {
  connect?: Array<PostWhereUniqueInput | null> | null
  create?: Array<PostCreateInput | null> | null
  connectOrCreate?: Array<PostConnectOrCreateInput | null> | null
  update?: Array<PostUpdateUniqueInput | null> | null
  upsert?: Array<PostUpsertUniqueInput | null> | null
  delete?: Array<PostDeleteUniqueInput | null> | null
  disconnect?: Array<PostWhereUniqueInput | null> | null
  set?: Array<PostWhereUniqueInput | null> | null
  updateMany?: Array<PostUpdateManyInput | null> | null
  deleteMany?: Array<PostDeleteManyInput | null> | null
}

export type PostUpdateUniqueInput = {
  data: PostUpdateInput
  where: PostWhereUniqueInput
}

export type PostUpdateInput = {
  id?: number | null
  title?: string | null
  content?: string | null
  createdAt?: string | null
  published?: boolean | null
  author?: PostAuthorUpdateRelationsInput | null
}

export type PostAuthorUpdateRelationsInput = {
  connect?: UserWhereUniqueInput | null
  create?: UserCreateInput | null
  connectOrCreate?: UserConnectOrCreateInput | null
  update?: UserUpdateInput | null
  upsert?: UserUpsertInput | null
  delete?: boolean | null
  disconnect?: boolean | null
}

export type UserUpsertInput = {
  create: UserCreateInput
  update: UserUpdateInput
}

export type PostUpsertUniqueInput = {
  where: PostWhereUniqueInput
  create: PostCreateInput
  update: PostUpdateInput
}

export type PostDeleteUniqueInput = {
  where: PostWhereUniqueInput
}

export type PostUpdateManyInput = {
  where: PostWhereInput
  data: PostUpdateInput
}

export type PostWhereInput = {
  OR?: Array<PostWhereInput | null> | null
  NOT?: Array<PostWhereInput | null> | null
  AND?: Array<PostWhereInput | null> | null
  id?: IntFilter | null
  title?: StringFilter | null
  content?: StringFilter | null
  createdAt?: AWSDateTimeFilter | null
  published?: BooleanFilter | null
  author?: UserWhereInput | null
  authorId?: IntFilter | null
}

export type IntFilter = {
  equals?: number | null
  gt?: number | null
  gte?: number | null
  in?: Array<number> | null
  lt?: number | null
  lte?: number | null
  not?: IntFilter | null
  notIn?: Array<number> | null
}

export type StringFilter = {
  contains?: string | null
  endsWith?: string | null
  equals?: string | null
  in?: Array<string> | null
  not?: StringFilter | null
  notIn?: Array<string> | null
  startsWith?: string | null
  mode?: string | null
}

export type AWSDateTimeFilter = {
  equals?: string | null
  gt?: string | null
  gte?: string | null
  in?: Array<string> | null
  lt?: string | null
  lte?: string | null
  not?: AWSDateTimeFilter | null
  notIn?: Array<string> | null
}

export type BooleanFilter = {
  equals?: boolean | null
  not?: BooleanFilter | null
}

export type UserWhereInput = {
  OR?: Array<UserWhereInput | null> | null
  NOT?: Array<UserWhereInput | null> | null
  AND?: Array<UserWhereInput | null> | null
  id?: IntFilter | null
  email?: AWSEmailFilter | null
  name?: StringFilter | null
  posts?: PostFilter | null
}

export type AWSEmailFilter = {
  contains?: string | null
  endsWith?: string | null
  equals?: string | null
  in?: Array<string> | null
  not?: AWSEmailFilter | null
  notIn?: Array<string> | null
  startsWith?: string | null
}

export type PostFilter = {
  some?: PostWhereInput | null
  every?: PostWhereInput | null
  none?: PostWhereInput | null
}

export type PostDeleteManyInput = {
  where: PostWhereInput
}

export type UserOperationInput = {
  id?: IntOperation | null
}

export type IntOperation = {
  set?: number | null
  increment?: number | null
  decrement?: number | null
  multiply?: number | null
  divide?: number | null
}

export type PostCreateManyInput = {
  id?: number | null
  title: string
  content?: string | null
  createdAt?: string | null
  published: boolean
}

export type PostOperationInput = {
  id?: IntOperation | null
}

export type UserOrderByInput = {
  id?: OrderByArg | null
  email?: OrderByArg | null
  name?: OrderByArg | null
  posts?: PostOrderByInput | null
}

export enum OrderByArg {
  ASC = "ASC",
  DESC = "DESC",
}

export type PostOrderByInput = {
  id?: OrderByArg | null
  title?: OrderByArg | null
  content?: OrderByArg | null
  createdAt?: OrderByArg | null
  published?: OrderByArg | null
  author?: UserOrderByInput | null
  authorId?: OrderByArg | null
}

export type CreateUserMutationVariables = {
  data: UserCreateInput
}

export type CreateUserMutation = {
  createUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type CreateManyUsersMutationVariables = {
  data?: Array<UserCreateManyInput> | null
  skipDuplicates?: boolean | null
}

export type CreateManyUsersMutation = {
  createManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type UpdateUserMutationVariables = {
  where: UserWhereUniqueInput
  data?: UserUpdateInput | null
  operation?: UserOperationInput | null
}

export type UpdateUserMutation = {
  updateUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type UpdateManyUsersMutationVariables = {
  where: UserWhereInput
  data?: UserUpdateInput | null
  operation?: UserOperationInput | null
}

export type UpdateManyUsersMutation = {
  updateManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type UpsertUserMutationVariables = {
  data: UserUpdateInput
  where: UserWhereUniqueInput
}

export type UpsertUserMutation = {
  upsertUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type DeleteUserMutationVariables = {
  where: UserWhereUniqueInput
}

export type DeleteUserMutation = {
  deleteUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type DeleteManyUsersMutationVariables = {
  where: UserWhereInput
}

export type DeleteManyUsersMutation = {
  deleteManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type CreatePostMutationVariables = {
  data: PostCreateInput
}

export type CreatePostMutation = {
  createPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type CreateManyPostsMutationVariables = {
  data?: Array<PostCreateManyInput> | null
  skipDuplicates?: boolean | null
}

export type CreateManyPostsMutation = {
  createManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type UpdatePostMutationVariables = {
  where: PostWhereUniqueInput
  data?: PostUpdateInput | null
  operation?: PostOperationInput | null
}

export type UpdatePostMutation = {
  updatePost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type UpdateManyPostsMutationVariables = {
  where: PostWhereInput
  data?: PostUpdateInput | null
  operation?: PostOperationInput | null
}

export type UpdateManyPostsMutation = {
  updateManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type UpsertPostMutationVariables = {
  data: PostUpdateInput
  where: PostWhereUniqueInput
}

export type UpsertPostMutation = {
  upsertPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type DeletePostMutationVariables = {
  where: PostWhereUniqueInput
}

export type DeletePostMutation = {
  deletePost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type DeleteManyPostsMutationVariables = {
  where: PostWhereInput
}

export type DeleteManyPostsMutation = {
  deleteManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type GetUserQueryVariables = {
  where: UserWhereUniqueInput
}

export type GetUserQuery = {
  getUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type ListUsersQueryVariables = {
  where?: UserWhereInput | null
  orderBy?: Array<UserOrderByInput | null> | null
  skip?: number | null
  take?: number | null
}

export type ListUsersQuery = {
  listUsers?: Array<{
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null> | null
}

export type CountUsersQueryVariables = {
  where?: UserWhereInput | null
  orderBy?: Array<UserOrderByInput | null> | null
  skip?: number | null
  take?: number | null
}

export type CountUsersQuery = {
  countUsers?: number | null
}

export type GetPostQueryVariables = {
  where: PostWhereUniqueInput
}

export type GetPostQuery = {
  getPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type ListPostsQueryVariables = {
  where?: PostWhereInput | null
  orderBy?: Array<PostOrderByInput | null> | null
  skip?: number | null
  take?: number | null
}

export type ListPostsQuery = {
  listPosts?: Array<{
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null> | null
}

export type CountPostsQueryVariables = {
  where?: PostWhereInput | null
  orderBy?: Array<PostOrderByInput | null> | null
  skip?: number | null
  take?: number | null
}

export type CountPostsQuery = {
  countPosts?: number | null
}

export type OnCreatedUserSubscriptionVariables = {
  id?: number | null
  email?: string | null
}

export type OnCreatedUserSubscription = {
  onCreatedUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type OnUpdatedUserSubscriptionVariables = {
  id?: number | null
  email?: string | null
}

export type OnUpdatedUserSubscription = {
  onUpdatedUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type OnUpsertedUserSubscriptionVariables = {
  id?: number | null
  email?: string | null
}

export type OnUpsertedUserSubscription = {
  onUpsertedUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type OnDeletedUserSubscriptionVariables = {
  id?: number | null
  email?: string | null
}

export type OnDeletedUserSubscription = {
  onDeletedUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type OnMutatedUserSubscriptionVariables = {
  id?: number | null
  email?: string | null
}

export type OnMutatedUserSubscription = {
  onMutatedUser?: {
    __typename: "User"
    id: number
    email: string
    name: string
    posts?: Array<{
      __typename: "Post"
      id: number
      title: string
      content?: string | null
      createdAt: string
      published: boolean
      author: {
        __typename: "User"
        id: number
        email: string
        name: string
      }
      authorId: number
    } | null> | null
  } | null
}

export type OnCreatedManyUsersSubscription = {
  onCreatedManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnUpdatedManyUsersSubscription = {
  onUpdatedManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnMutatedManyUsersSubscription = {
  onMutatedManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnDeletedManyUsersSubscription = {
  onDeletedManyUsers?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnCreatedPostSubscriptionVariables = {
  id?: number | null
}

export type OnCreatedPostSubscription = {
  onCreatedPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type OnUpdatedPostSubscriptionVariables = {
  id?: number | null
}

export type OnUpdatedPostSubscription = {
  onUpdatedPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type OnUpsertedPostSubscriptionVariables = {
  id?: number | null
}

export type OnUpsertedPostSubscription = {
  onUpsertedPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type OnDeletedPostSubscriptionVariables = {
  id?: number | null
}

export type OnDeletedPostSubscription = {
  onDeletedPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type OnMutatedPostSubscriptionVariables = {
  id?: number | null
}

export type OnMutatedPostSubscription = {
  onMutatedPost?: {
    __typename: "Post"
    id: number
    title: string
    content?: string | null
    createdAt: string
    published: boolean
    author: {
      __typename: "User"
      id: number
      email: string
      name: string
      posts?: Array<{
        __typename: "Post"
        id: number
        title: string
        content?: string | null
        createdAt: string
        published: boolean
        authorId: number
      } | null> | null
    }
    authorId: number
  } | null
}

export type OnCreatedManyPostsSubscription = {
  onCreatedManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnUpdatedManyPostsSubscription = {
  onUpdatedManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnMutatedManyPostsSubscription = {
  onMutatedManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}

export type OnDeletedManyPostsSubscription = {
  onDeletedManyPosts?: {
    __typename: "BatchPayload"
    count?: number | null
  } | null
}
