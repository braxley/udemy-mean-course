import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendPost, Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts$$ = new BehaviorSubject<Post[] | null>(null);

  get posts$() {
    return this.posts$$.asObservable();
  }

  get posts() {
    return this.posts$$.value;
  }

  constructor(private httpClient: HttpClient) {
    this.initPosts();
  }

  initPosts() {
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
        this.posts$$.next(transformedPosts);
      });
  }

  getPost(postId: string): Observable<BackendPost> {
    // the non-null assertion operator is here for a quick fix
    // return { ...this.posts.find((post: Post) => post.id === postId)! };
    return this.httpClient.get<BackendPost>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.httpClient
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        post.id = responseData.postId;
        this.posts$$.value!.push(post);
      });
  }

  updatePost(id: string, title: string, content: string) {
    this.httpClient
      .put(`http://localhost:3000/api/posts/${id}`, { title, content })
      .subscribe(() => {
        const postInArray = this.posts!.find((post: Post) => post.id === id);
        if (postInArray) {
          postInArray.title = title;
          postInArray.content = content;
        }
      });
  }

  deletePost(postId: string | null) {
    this.httpClient
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        console.log('Post deleted!');
        const updatedPosts = this.posts!.filter((post) => post.id !== postId);
        this.posts$$.next(updatedPosts);
      });
  }
}
