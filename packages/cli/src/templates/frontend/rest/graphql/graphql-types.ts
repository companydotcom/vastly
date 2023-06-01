import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: Date;
  AWSEmail: string;
  AWSIPAddress: any;
  AWSJSON: string;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: string;
  AWSURL: string;
  BigInt: any;
  Double: any;
};

export type AwsDateTimeFilter = {
  equals?: InputMaybe<Scalars['AWSDateTime']>;
  gt?: InputMaybe<Scalars['AWSDateTime']>;
  gte?: InputMaybe<Scalars['AWSDateTime']>;
  in?: InputMaybe<Array<Scalars['AWSDateTime']>>;
  lt?: InputMaybe<Scalars['AWSDateTime']>;
  lte?: InputMaybe<Scalars['AWSDateTime']>;
  not?: InputMaybe<AwsDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSDateTime']>>;
};

export type AwsDateTimeListFilter = {
  equals?: InputMaybe<Array<Scalars['AWSDateTime']>>;
  has?: InputMaybe<Scalars['AWSDateTime']>;
  hasEvery?: InputMaybe<Array<Scalars['AWSDateTime']>>;
  hasSome?: InputMaybe<Array<Scalars['AWSDateTime']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type AwsDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['AWSDateTime']>;
  gt?: InputMaybe<Scalars['AWSDateTime']>;
  gte?: InputMaybe<Scalars['AWSDateTime']>;
  in?: InputMaybe<Array<Scalars['AWSDateTime']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['AWSDateTime']>;
  lte?: InputMaybe<Scalars['AWSDateTime']>;
  not?: InputMaybe<AwsDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSDateTime']>>;
};

export type AwsEmailFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSEmail']>;
  in?: InputMaybe<Array<Scalars['AWSEmail']>>;
  not?: InputMaybe<AwsEmailFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSEmail']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type AwsEmailListFilter = {
  equals?: InputMaybe<Array<Scalars['AWSEmail']>>;
  has?: InputMaybe<Scalars['AWSEmail']>;
  hasEvery?: InputMaybe<Array<Scalars['AWSEmail']>>;
  hasSome?: InputMaybe<Array<Scalars['AWSEmail']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type AwsEmailNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSEmail']>;
  in?: InputMaybe<Array<Scalars['AWSEmail']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<AwsEmailFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSEmail']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type AwsjsonFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSJSON']>;
  in?: InputMaybe<Array<Scalars['AWSJSON']>>;
  not?: InputMaybe<AwsjsonFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSJSON']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type AwsjsonListFilter = {
  equals?: InputMaybe<Array<Scalars['AWSJSON']>>;
  has?: InputMaybe<Scalars['AWSJSON']>;
  hasEvery?: InputMaybe<Array<Scalars['AWSJSON']>>;
  hasSome?: InputMaybe<Array<Scalars['AWSJSON']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type AwsjsonNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSJSON']>;
  in?: InputMaybe<Array<Scalars['AWSJSON']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<AwsjsonFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSJSON']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type AwsurlFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSURL']>;
  in?: InputMaybe<Array<Scalars['AWSURL']>>;
  not?: InputMaybe<AwsurlFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSURL']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type AwsurlListFilter = {
  equals?: InputMaybe<Array<Scalars['AWSURL']>>;
  has?: InputMaybe<Scalars['AWSURL']>;
  hasEvery?: InputMaybe<Array<Scalars['AWSURL']>>;
  hasSome?: InputMaybe<Array<Scalars['AWSURL']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type AwsurlNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['AWSURL']>;
  in?: InputMaybe<Array<Scalars['AWSURL']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<AwsurlFilter>;
  notIn?: InputMaybe<Array<Scalars['AWSURL']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  count?: Maybe<Scalars['Int']>;
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<BooleanFilter>;
};

export type BooleanListFilter = {
  equals?: InputMaybe<Array<Scalars['Boolean']>>;
  has?: InputMaybe<Scalars['Boolean']>;
  hasEvery?: InputMaybe<Array<Scalars['Boolean']>>;
  hasSome?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type BooleanNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<BooleanFilter>;
};

export type FloatFilter = {
  equals?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<FloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

export type FloatListFilter = {
  equals?: InputMaybe<Array<Scalars['Float']>>;
  has?: InputMaybe<Scalars['Float']>;
  hasEvery?: InputMaybe<Array<Scalars['Float']>>;
  hasSome?: InputMaybe<Array<Scalars['Float']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type FloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<FloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

export type FloatOperation = {
  decrement?: InputMaybe<Scalars['Float']>;
  divide?: InputMaybe<Scalars['Float']>;
  increment?: InputMaybe<Scalars['Float']>;
  multiply?: InputMaybe<Scalars['Float']>;
  set?: InputMaybe<Scalars['Float']>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<IntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type IntListFilter = {
  equals?: InputMaybe<Array<Scalars['Int']>>;
  has?: InputMaybe<Scalars['Int']>;
  hasEvery?: InputMaybe<Array<Scalars['Int']>>;
  hasSome?: InputMaybe<Array<Scalars['Int']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<IntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type IntOperation = {
  decrement?: InputMaybe<Scalars['Int']>;
  divide?: InputMaybe<Scalars['Int']>;
  increment?: InputMaybe<Scalars['Int']>;
  multiply?: InputMaybe<Scalars['Int']>;
  set?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create multiple new Post records. */
  createManyPosts?: Maybe<BatchPayload>;
  /** Create multiple new User records. */
  createManyUsers?: Maybe<BatchPayload>;
  /** Create a new single Post record. */
  createPost?: Maybe<Post>;
  /** Create a new single User record. */
  createUser?: Maybe<User>;
  /** Delete multiple Post records. */
  deleteManyPosts?: Maybe<BatchPayload>;
  /** Delete multiple User records. */
  deleteManyUsers?: Maybe<BatchPayload>;
  /** Delete a single Post record. */
  deletePost?: Maybe<Post>;
  /** Delete a single User record. */
  deleteUser?: Maybe<User>;
  /** Update multiple existing Post records. */
  updateManyPosts?: Maybe<BatchPayload>;
  /** Update multiple existing User records. */
  updateManyUsers?: Maybe<BatchPayload>;
  /** Update an existing single Post record. */
  updatePost?: Maybe<Post>;
  /** Update an existing single User record. */
  updateUser?: Maybe<User>;
  /** Update an existing or create a new single Post record. */
  upsertPost?: Maybe<Post>;
  /** Update an existing or create a new single User record. */
  upsertUser?: Maybe<User>;
};


export type MutationCreateManyPostsArgs = {
  data?: InputMaybe<Array<PostCreateManyInput>>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateManyUsersArgs = {
  data?: InputMaybe<Array<UserCreateManyInput>>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreatePostArgs = {
  data: PostCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationDeleteManyPostsArgs = {
  where: PostWhereInput;
};


export type MutationDeleteManyUsersArgs = {
  where: UserWhereInput;
};


export type MutationDeletePostArgs = {
  where: PostWhereUniqueInput;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationUpdateManyPostsArgs = {
  data?: InputMaybe<PostUpdateInput>;
  operation?: InputMaybe<PostOperationInput>;
  where: PostWhereInput;
};


export type MutationUpdateManyUsersArgs = {
  data?: InputMaybe<UserUpdateInput>;
  operation?: InputMaybe<UserOperationInput>;
  where: UserWhereInput;
};


export type MutationUpdatePostArgs = {
  data?: InputMaybe<PostUpdateInput>;
  operation?: InputMaybe<PostOperationInput>;
  where: PostWhereUniqueInput;
};


export type MutationUpdateUserArgs = {
  data?: InputMaybe<UserUpdateInput>;
  operation?: InputMaybe<UserOperationInput>;
  where: UserWhereUniqueInput;
};


export type MutationUpsertPostArgs = {
  create: PostCreateInput;
  update: PostUpdateInput;
  where: PostWhereUniqueInput;
};


export type MutationUpsertUserArgs = {
  create: UserCreateInput;
  update: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export enum NullArg {
  Null = 'NULL'
}

export enum OrderByArg {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['Int'];
  published?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  views?: Maybe<Scalars['Int']>;
};

export type PostAuthorCreateNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserConnectOrCreateInput>;
  create?: InputMaybe<UserCreateInput>;
};

export type PostAuthorUpdateNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserConnectOrCreateInput>;
  create?: InputMaybe<UserCreateInput>;
  delete?: InputMaybe<Scalars['Boolean']>;
  disconnect?: InputMaybe<Scalars['Boolean']>;
  update?: InputMaybe<UserUpdateInput>;
  upsert?: InputMaybe<UserUpsertInput>;
};

export type PostConnectOrCreateInput = {
  create: PostCreateInput;
  where: PostWhereUniqueInput;
};

export type PostCreateInput = {
  author?: InputMaybe<PostAuthorCreateNestedInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['Int']>;
  published?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  views?: InputMaybe<Scalars['Int']>;
};

export type PostCreateManyInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['Int']>;
  published?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  views?: InputMaybe<Scalars['Int']>;
};

export type PostExtendedWhereUniqueInput = {
  AND?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<IntNullableFilter>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  id?: InputMaybe<Scalars['Int']>;
  published?: InputMaybe<BooleanNullableFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<AwsDateTimeFilter>;
  views?: InputMaybe<IntNullableFilter>;
};

export type PostFilter = {
  every?: InputMaybe<PostWhereInputWithoutNullables>;
  none?: InputMaybe<PostWhereInputWithoutNullables>;
  some?: InputMaybe<PostWhereInputWithoutNullables>;
};

export type PostOperationInput = {
  id?: InputMaybe<IntOperation>;
  views?: InputMaybe<IntOperation>;
};

export type PostOrderByInput = {
  author?: InputMaybe<UserOrderByInput>;
  authorId?: InputMaybe<OrderByArg>;
  createdAt?: InputMaybe<OrderByArg>;
  id?: InputMaybe<OrderByArg>;
  published?: InputMaybe<OrderByArg>;
  title?: InputMaybe<OrderByArg>;
  updatedAt?: InputMaybe<OrderByArg>;
  views?: InputMaybe<OrderByArg>;
};

export type PostScalarWhereInput = {
  AND?: InputMaybe<Array<InputMaybe<PostScalarWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<PostScalarWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<PostScalarWhereInput>>>;
  authorId?: InputMaybe<IntNullableFilter>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  published?: InputMaybe<BooleanNullableFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<AwsDateTimeFilter>;
  views?: InputMaybe<IntNullableFilter>;
};

export type PostUpdateInput = {
  author?: InputMaybe<PostAuthorUpdateNestedInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['Int']>;
  published?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  views?: InputMaybe<Scalars['Int']>;
};

export type PostUpdateManyInput = {
  data: PostUpdateInput;
  where: PostScalarWhereInput;
};

export type PostUpdateUniqueInput = {
  data: PostUpdateInput;
  where: PostWhereUniqueInput;
};

export type PostUpsertInput = {
  create: PostCreateInput;
  update: PostUpdateInput;
};

export type PostUpsertUniqueInput = {
  create: PostCreateInput;
  update: PostUpdateInput;
  where: PostWhereUniqueInput;
};

export type PostWhereInput = {
  AND?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<IntNullableFilter>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  is?: InputMaybe<NullArg>;
  isNot?: InputMaybe<NullArg>;
  published?: InputMaybe<BooleanNullableFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<AwsDateTimeFilter>;
  views?: InputMaybe<IntNullableFilter>;
};

export type PostWhereInputWithoutNullables = {
  AND?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<PostWhereInput>>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<IntNullableFilter>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  published?: InputMaybe<BooleanNullableFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<AwsDateTimeFilter>;
  views?: InputMaybe<IntNullableFilter>;
};

export type PostWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /** Count all Post records (optional query filters). */
  countPosts?: Maybe<Scalars['Int']>;
  /** Count all User records (optional query filters). */
  countUsers?: Maybe<Scalars['Int']>;
  /** Find a single Post record by unique identifier. */
  getPost?: Maybe<Post>;
  /** Find a single User record by unique identifier. */
  getUser?: Maybe<User>;
  /** Find many Post records (optional query filters). */
  listPosts?: Maybe<Array<Maybe<Post>>>;
  /** Find many User records (optional query filters). */
  listUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryCountPostsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<PostOrderByInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PostWhereInput>;
};


export type QueryCountUsersArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<UserOrderByInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserWhereInput>;
};


export type QueryGetPostArgs = {
  where: PostWhereUniqueInput;
};


export type QueryGetUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryListPostsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<PostOrderByInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PostWhereInput>;
};


export type QueryListUsersArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<UserOrderByInput>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserWhereInput>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  mode?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<StringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type StringListFilter = {
  equals?: InputMaybe<Array<Scalars['String']>>;
  has?: InputMaybe<Scalars['String']>;
  hasEvery?: InputMaybe<Array<Scalars['String']>>;
  hasSome?: InputMaybe<Array<Scalars['String']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  mode?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<StringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered from `createManyPosts` mutation. */
  onCreatedManyPosts?: Maybe<BatchPayload>;
  /** Triggered from `createManyUsers` mutation. */
  onCreatedManyUsers?: Maybe<BatchPayload>;
  /** Triggered from `createPost` mutation (excl. `createManyPosts` and `upsertPost`). */
  onCreatedPost?: Maybe<Post>;
  /** Triggered from `createUser` mutation (excl. `createManyUsers` and `upsertUser`). */
  onCreatedUser?: Maybe<User>;
  /** Triggered from `deleteManyPosts` mutation. */
  onDeletedManyPosts?: Maybe<BatchPayload>;
  /** Triggered from `deleteManyUsers` mutation. */
  onDeletedManyUsers?: Maybe<BatchPayload>;
  /** Triggered from `deletePost` mutation (excl. `deleteManyPosts`). */
  onDeletedPost?: Maybe<Post>;
  /** Triggered from `deleteUser` mutation (excl. `deleteManyUsers`). */
  onDeletedUser?: Maybe<User>;
  /** Triggered from ANY MULTIPLE records mutation. */
  onMutatedManyPosts?: Maybe<BatchPayload>;
  /** Triggered from ANY MULTIPLE records mutation. */
  onMutatedManyUsers?: Maybe<BatchPayload>;
  /** Triggered from ANY SINGLE record mutation. */
  onMutatedPost?: Maybe<Post>;
  /** Triggered from ANY SINGLE record mutation. */
  onMutatedUser?: Maybe<User>;
  /** Triggered from `updateManyPosts` mutation. */
  onUpdatedManyPosts?: Maybe<BatchPayload>;
  /** Triggered from `updateManyUsers` mutation. */
  onUpdatedManyUsers?: Maybe<BatchPayload>;
  /** Triggered from `updatePost` mutation (excl. `updateManyPosts` and `upsertPost`). */
  onUpdatedPost?: Maybe<Post>;
  /** Triggered from `updateUser` mutation (excl. `updateManyUsers` and `upsertUser`). */
  onUpdatedUser?: Maybe<User>;
  /** Triggered from `upsertPost` mutation. */
  onUpsertedPost?: Maybe<Post>;
  /** Triggered from `upsertUser` mutation. */
  onUpsertedUser?: Maybe<User>;
};


export type SubscriptionOnCreatedPostArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnCreatedUserArgs = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnDeletedPostArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnDeletedUserArgs = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnMutatedPostArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnMutatedUserArgs = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnUpdatedPostArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnUpdatedUserArgs = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnUpsertedPostArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type SubscriptionOnUpsertedUserArgs = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  email: Scalars['AWSEmail'];
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type UserConnectOrCreateInput = {
  create: UserCreateInput;
  where: UserWhereUniqueInput;
};

export type UserCreateInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  email: Scalars['AWSEmail'];
  fullname?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  posts?: InputMaybe<UserPostsCreateNestedInput>;
};

export type UserCreateManyInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  email: Scalars['AWSEmail'];
  fullname?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};

export type UserExtendedWhereUniqueInput = {
  AND?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  fullname?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['Int']>;
  posts?: InputMaybe<PostFilter>;
};

export type UserFilter = {
  every?: InputMaybe<UserWhereInputWithoutNullables>;
  none?: InputMaybe<UserWhereInputWithoutNullables>;
  some?: InputMaybe<UserWhereInputWithoutNullables>;
};

export type UserOperationInput = {
  id?: InputMaybe<IntOperation>;
};

export type UserOrderByInput = {
  createdAt?: InputMaybe<OrderByArg>;
  email?: InputMaybe<OrderByArg>;
  fullname?: InputMaybe<OrderByArg>;
  id?: InputMaybe<OrderByArg>;
  posts?: InputMaybe<PostOrderByInput>;
};

export type UserPostsCreateNestedInput = {
  connect?: InputMaybe<Array<InputMaybe<PostWhereUniqueInput>>>;
  connectOrCreate?: InputMaybe<Array<InputMaybe<PostConnectOrCreateInput>>>;
  create?: InputMaybe<Array<InputMaybe<PostCreateInput>>>;
};

export type UserPostsUpdateNestedInput = {
  connect?: InputMaybe<Array<InputMaybe<PostWhereUniqueInput>>>;
  connectOrCreate?: InputMaybe<Array<InputMaybe<PostConnectOrCreateInput>>>;
  create?: InputMaybe<Array<InputMaybe<PostCreateInput>>>;
  delete?: InputMaybe<Array<InputMaybe<PostWhereUniqueInput>>>;
  deleteMany?: InputMaybe<Array<InputMaybe<PostScalarWhereInput>>>;
  disconnect?: InputMaybe<Array<InputMaybe<PostWhereUniqueInput>>>;
  set?: InputMaybe<Array<InputMaybe<PostWhereUniqueInput>>>;
  update?: InputMaybe<Array<InputMaybe<PostUpdateUniqueInput>>>;
  updateMany?: InputMaybe<Array<InputMaybe<PostUpdateManyInput>>>;
  upsert?: InputMaybe<Array<InputMaybe<PostUpsertUniqueInput>>>;
};

export type UserScalarWhereInput = {
  AND?: InputMaybe<Array<InputMaybe<UserScalarWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<UserScalarWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<UserScalarWhereInput>>>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  email?: InputMaybe<AwsEmailFilter>;
  fullname?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
};

export type UserUpdateInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  fullname?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  posts?: InputMaybe<UserPostsUpdateNestedInput>;
};

export type UserUpdateManyInput = {
  data: UserUpdateInput;
  where: UserScalarWhereInput;
};

export type UserUpdateUniqueInput = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpsertInput = {
  create: UserCreateInput;
  update: UserUpdateInput;
};

export type UserUpsertUniqueInput = {
  create: UserCreateInput;
  update: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  email?: InputMaybe<AwsEmailFilter>;
  fullname?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  is?: InputMaybe<NullArg>;
  isNot?: InputMaybe<NullArg>;
  posts?: InputMaybe<PostFilter>;
};

export type UserWhereInputWithoutNullables = {
  AND?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  NOT?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  OR?: InputMaybe<Array<InputMaybe<UserWhereInput>>>;
  createdAt?: InputMaybe<AwsDateTimeFilter>;
  email?: InputMaybe<AwsEmailFilter>;
  fullname?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  posts?: InputMaybe<PostFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['Int']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  AWSDateTimeFilter: AwsDateTimeFilter;
  AWSDateTimeListFilter: AwsDateTimeListFilter;
  AWSDateTimeNullableFilter: AwsDateTimeNullableFilter;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  AWSEmailFilter: AwsEmailFilter;
  AWSEmailListFilter: AwsEmailListFilter;
  AWSEmailNullableFilter: AwsEmailNullableFilter;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSJSONFilter: AwsjsonFilter;
  AWSJSONListFilter: AwsjsonListFilter;
  AWSJSONNullableFilter: AwsjsonNullableFilter;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTime: ResolverTypeWrapper<Scalars['AWSTime']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
  AWSURLFilter: AwsurlFilter;
  AWSURLListFilter: AwsurlListFilter;
  AWSURLNullableFilter: AwsurlNullableFilter;
  BatchPayload: ResolverTypeWrapper<BatchPayload>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BooleanFilter: BooleanFilter;
  BooleanListFilter: BooleanListFilter;
  BooleanNullableFilter: BooleanNullableFilter;
  Double: ResolverTypeWrapper<Scalars['Double']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FloatFilter: FloatFilter;
  FloatListFilter: FloatListFilter;
  FloatNullableFilter: FloatNullableFilter;
  FloatOperation: FloatOperation;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntFilter: IntFilter;
  IntListFilter: IntListFilter;
  IntNullableFilter: IntNullableFilter;
  IntOperation: IntOperation;
  Mutation: ResolverTypeWrapper<{}>;
  NullArg: NullArg;
  OrderByArg: OrderByArg;
  Post: ResolverTypeWrapper<Post>;
  PostAuthorCreateNestedInput: PostAuthorCreateNestedInput;
  PostAuthorUpdateNestedInput: PostAuthorUpdateNestedInput;
  PostConnectOrCreateInput: PostConnectOrCreateInput;
  PostCreateInput: PostCreateInput;
  PostCreateManyInput: PostCreateManyInput;
  PostExtendedWhereUniqueInput: PostExtendedWhereUniqueInput;
  PostFilter: PostFilter;
  PostOperationInput: PostOperationInput;
  PostOrderByInput: PostOrderByInput;
  PostScalarWhereInput: PostScalarWhereInput;
  PostUpdateInput: PostUpdateInput;
  PostUpdateManyInput: PostUpdateManyInput;
  PostUpdateUniqueInput: PostUpdateUniqueInput;
  PostUpsertInput: PostUpsertInput;
  PostUpsertUniqueInput: PostUpsertUniqueInput;
  PostWhereInput: PostWhereInput;
  PostWhereInputWithoutNullables: PostWhereInputWithoutNullables;
  PostWhereUniqueInput: PostWhereUniqueInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringFilter: StringFilter;
  StringListFilter: StringListFilter;
  StringNullableFilter: StringNullableFilter;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserConnectOrCreateInput: UserConnectOrCreateInput;
  UserCreateInput: UserCreateInput;
  UserCreateManyInput: UserCreateManyInput;
  UserExtendedWhereUniqueInput: UserExtendedWhereUniqueInput;
  UserFilter: UserFilter;
  UserOperationInput: UserOperationInput;
  UserOrderByInput: UserOrderByInput;
  UserPostsCreateNestedInput: UserPostsCreateNestedInput;
  UserPostsUpdateNestedInput: UserPostsUpdateNestedInput;
  UserScalarWhereInput: UserScalarWhereInput;
  UserUpdateInput: UserUpdateInput;
  UserUpdateManyInput: UserUpdateManyInput;
  UserUpdateUniqueInput: UserUpdateUniqueInput;
  UserUpsertInput: UserUpsertInput;
  UserUpsertUniqueInput: UserUpsertUniqueInput;
  UserWhereInput: UserWhereInput;
  UserWhereInputWithoutNullables: UserWhereInputWithoutNullables;
  UserWhereUniqueInput: UserWhereUniqueInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSDateTime: Scalars['AWSDateTime'];
  AWSDateTimeFilter: AwsDateTimeFilter;
  AWSDateTimeListFilter: AwsDateTimeListFilter;
  AWSDateTimeNullableFilter: AwsDateTimeNullableFilter;
  AWSEmail: Scalars['AWSEmail'];
  AWSEmailFilter: AwsEmailFilter;
  AWSEmailListFilter: AwsEmailListFilter;
  AWSEmailNullableFilter: AwsEmailNullableFilter;
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSJSONFilter: AwsjsonFilter;
  AWSJSONListFilter: AwsjsonListFilter;
  AWSJSONNullableFilter: AwsjsonNullableFilter;
  AWSPhone: Scalars['AWSPhone'];
  AWSTime: Scalars['AWSTime'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
  AWSURLFilter: AwsurlFilter;
  AWSURLListFilter: AwsurlListFilter;
  AWSURLNullableFilter: AwsurlNullableFilter;
  BatchPayload: BatchPayload;
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  BooleanFilter: BooleanFilter;
  BooleanListFilter: BooleanListFilter;
  BooleanNullableFilter: BooleanNullableFilter;
  Double: Scalars['Double'];
  Float: Scalars['Float'];
  FloatFilter: FloatFilter;
  FloatListFilter: FloatListFilter;
  FloatNullableFilter: FloatNullableFilter;
  FloatOperation: FloatOperation;
  Int: Scalars['Int'];
  IntFilter: IntFilter;
  IntListFilter: IntListFilter;
  IntNullableFilter: IntNullableFilter;
  IntOperation: IntOperation;
  Mutation: {};
  Post: Post;
  PostAuthorCreateNestedInput: PostAuthorCreateNestedInput;
  PostAuthorUpdateNestedInput: PostAuthorUpdateNestedInput;
  PostConnectOrCreateInput: PostConnectOrCreateInput;
  PostCreateInput: PostCreateInput;
  PostCreateManyInput: PostCreateManyInput;
  PostExtendedWhereUniqueInput: PostExtendedWhereUniqueInput;
  PostFilter: PostFilter;
  PostOperationInput: PostOperationInput;
  PostOrderByInput: PostOrderByInput;
  PostScalarWhereInput: PostScalarWhereInput;
  PostUpdateInput: PostUpdateInput;
  PostUpdateManyInput: PostUpdateManyInput;
  PostUpdateUniqueInput: PostUpdateUniqueInput;
  PostUpsertInput: PostUpsertInput;
  PostUpsertUniqueInput: PostUpsertUniqueInput;
  PostWhereInput: PostWhereInput;
  PostWhereInputWithoutNullables: PostWhereInputWithoutNullables;
  PostWhereUniqueInput: PostWhereUniqueInput;
  Query: {};
  String: Scalars['String'];
  StringFilter: StringFilter;
  StringListFilter: StringListFilter;
  StringNullableFilter: StringNullableFilter;
  Subscription: {};
  User: User;
  UserConnectOrCreateInput: UserConnectOrCreateInput;
  UserCreateInput: UserCreateInput;
  UserCreateManyInput: UserCreateManyInput;
  UserExtendedWhereUniqueInput: UserExtendedWhereUniqueInput;
  UserFilter: UserFilter;
  UserOperationInput: UserOperationInput;
  UserOrderByInput: UserOrderByInput;
  UserPostsCreateNestedInput: UserPostsCreateNestedInput;
  UserPostsUpdateNestedInput: UserPostsUpdateNestedInput;
  UserScalarWhereInput: UserScalarWhereInput;
  UserUpdateInput: UserUpdateInput;
  UserUpdateManyInput: UserUpdateManyInput;
  UserUpdateUniqueInput: UserUpdateUniqueInput;
  UserUpsertInput: UserUpsertInput;
  UserUpsertUniqueInput: UserUpsertUniqueInput;
  UserWhereInput: UserWhereInput;
  UserWhereInputWithoutNullables: UserWhereInputWithoutNullables;
  UserWhereUniqueInput: UserWhereUniqueInput;
};

export type Aws_Api_KeyDirectiveArgs = { };

export type Aws_Api_KeyDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Api_KeyDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_AuthDirectiveArgs = {
  cognito_groups: Array<Scalars['String']>;
};

export type Aws_AuthDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_Cognito_User_PoolsDirectiveArgs = {
  cognito_groups?: Maybe<Array<Scalars['String']>>;
};

export type Aws_Cognito_User_PoolsDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Cognito_User_PoolsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_IamDirectiveArgs = { };

export type Aws_IamDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_IamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_OidcDirectiveArgs = { };

export type Aws_OidcDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_OidcDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_SubscribeDirectiveArgs = {
  mutations: Array<Scalars['String']>;
};

export type Aws_SubscribeDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_SubscribeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export interface AwsEmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSEmail'], any> {
  name: 'AWSEmail';
}

export interface AwsipAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSIPAddress'], any> {
  name: 'AWSIPAddress';
}

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export interface AwsPhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSPhone'], any> {
  name: 'AWSPhone';
}

export interface AwsTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTime'], any> {
  name: 'AWSTime';
}

export interface AwsTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTimestamp'], any> {
  name: 'AWSTimestamp';
}

export interface AwsurlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSURL'], any> {
  name: 'AWSURL';
}

export type BatchPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchPayload'] = ResolversParentTypes['BatchPayload']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DoubleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Double'], any> {
  name: 'Double';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createManyPosts?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, Partial<MutationCreateManyPostsArgs>>;
  createManyUsers?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, Partial<MutationCreateManyUsersArgs>>;
  createPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'data'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  deleteManyPosts?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, RequireFields<MutationDeleteManyPostsArgs, 'where'>>;
  deleteManyUsers?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, RequireFields<MutationDeleteManyUsersArgs, 'where'>>;
  deletePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'where'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'where'>>;
  updateManyPosts?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyPostsArgs, 'where'>>;
  updateManyUsers?: Resolver<Maybe<ResolversTypes['BatchPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyUsersArgs, 'where'>>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'where'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'where'>>;
  upsertPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationUpsertPostArgs, 'create' | 'update' | 'where'>>;
  upsertUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpsertUserArgs, 'create' | 'update' | 'where'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  authorId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  published?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  countPosts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QueryCountPostsArgs>>;
  countUsers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QueryCountUsersArgs>>;
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'where'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'where'>>;
  listPosts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, Partial<QueryListPostsArgs>>;
  listUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<QueryListUsersArgs>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  onCreatedManyPosts?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onCreatedManyPosts", ParentType, ContextType>;
  onCreatedManyUsers?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onCreatedManyUsers", ParentType, ContextType>;
  onCreatedPost?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "onCreatedPost", ParentType, ContextType, Partial<SubscriptionOnCreatedPostArgs>>;
  onCreatedUser?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "onCreatedUser", ParentType, ContextType, Partial<SubscriptionOnCreatedUserArgs>>;
  onDeletedManyPosts?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onDeletedManyPosts", ParentType, ContextType>;
  onDeletedManyUsers?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onDeletedManyUsers", ParentType, ContextType>;
  onDeletedPost?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "onDeletedPost", ParentType, ContextType, Partial<SubscriptionOnDeletedPostArgs>>;
  onDeletedUser?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "onDeletedUser", ParentType, ContextType, Partial<SubscriptionOnDeletedUserArgs>>;
  onMutatedManyPosts?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onMutatedManyPosts", ParentType, ContextType>;
  onMutatedManyUsers?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onMutatedManyUsers", ParentType, ContextType>;
  onMutatedPost?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "onMutatedPost", ParentType, ContextType, Partial<SubscriptionOnMutatedPostArgs>>;
  onMutatedUser?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "onMutatedUser", ParentType, ContextType, Partial<SubscriptionOnMutatedUserArgs>>;
  onUpdatedManyPosts?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onUpdatedManyPosts", ParentType, ContextType>;
  onUpdatedManyUsers?: SubscriptionResolver<Maybe<ResolversTypes['BatchPayload']>, "onUpdatedManyUsers", ParentType, ContextType>;
  onUpdatedPost?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "onUpdatedPost", ParentType, ContextType, Partial<SubscriptionOnUpdatedPostArgs>>;
  onUpdatedUser?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "onUpdatedUser", ParentType, ContextType, Partial<SubscriptionOnUpdatedUserArgs>>;
  onUpsertedPost?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "onUpsertedPost", ParentType, ContextType, Partial<SubscriptionOnUpsertedPostArgs>>;
  onUpsertedUser?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "onUpsertedUser", ParentType, ContextType, Partial<SubscriptionOnUpsertedUserArgs>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['AWSEmail'], ParentType, ContextType>;
  fullname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSDateTime?: GraphQLScalarType;
  AWSEmail?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
  BatchPayload?: BatchPayloadResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Double?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  aws_api_key?: Aws_Api_KeyDirectiveResolver<any, any, ContextType>;
  aws_auth?: Aws_AuthDirectiveResolver<any, any, ContextType>;
  aws_cognito_user_pools?: Aws_Cognito_User_PoolsDirectiveResolver<any, any, ContextType>;
  aws_iam?: Aws_IamDirectiveResolver<any, any, ContextType>;
  aws_oidc?: Aws_OidcDirectiveResolver<any, any, ContextType>;
  aws_subscribe?: Aws_SubscribeDirectiveResolver<any, any, ContextType>;
};


export const ListUsersDocument = gql`
    query ListUsers {
  listUsers {
    id
    email
    fullname
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListUsersQuery(baseOptions?: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: UserCreateInput!) {
  createUser(data: $data) {
    email
    fullname
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const OnCreatedUserDocument = gql`
    subscription OnCreatedUser($id: Int, $email: AWSEmail) {
  onCreatedUser(id: $id, email: $email) {
    id
    email
    fullname
  }
}
    `;

/**
 * __useOnCreatedUserSubscription__
 *
 * To run a query within a React component, call `useOnCreatedUserSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnCreatedUserSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnCreatedUserSubscription({
 *   variables: {
 *      id: // value for 'id'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useOnCreatedUserSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnCreatedUserSubscription, OnCreatedUserSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnCreatedUserSubscription, OnCreatedUserSubscriptionVariables>(OnCreatedUserDocument, options);
      }
export type OnCreatedUserSubscriptionHookResult = ReturnType<typeof useOnCreatedUserSubscription>;
export type OnCreatedUserSubscriptionResult = Apollo.SubscriptionResult<OnCreatedUserSubscription>;