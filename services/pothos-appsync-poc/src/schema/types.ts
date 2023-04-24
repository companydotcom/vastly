export interface User {
  id: number
  email: string
  name: string
  posts: [Post]
}

export interface Post {
  id: number
  title: string
  content: string
  createdAt: Date
  published: boolean
  author: User
  authorId: number
}
