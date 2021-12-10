import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendPost, Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: BackendPost[] }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(
        map((postData: { message: string; posts: BackendPost[] }) => {
          return postData.posts.map((post: BackendPost) => {
            const transformedPost: Post = {
              title: post.title,
              content: post.content,
              id: post._id,
            };
            return transformedPost;
          });
        })
      )
      .subscribe((transformedPosts: Post[]) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string): Post {
    // the non-null assertion operator is here for a quick fix
    return { ...this.posts.find((post: Post) => post.id === postId)! };
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string | null) {
    this.httpClient
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        console.log('Post deleted!');
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next(updatedPosts);
      });
  }
}
