import { Profile } from './profile';

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}

export class Comment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;

  constructor(id: number, body: string, createdAt: string, author: Profile) {
    this.id = id;
    this.body = body;
    this.createdAt = createdAt;
    this.author = author;
  }
}