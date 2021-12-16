import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private httpClient: HttpClient, private router: Router) {
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
              imagePath: '',
            };
            // imagePath will be adapted later
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

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          title: title,
          content: content,
          id: responseData.post.id,
          imagePath: responseData.post.imagePath,
        };
        this.posts ? this.posts?.push(post) : this.posts$$.next([post]);
        this.router.navigate(['/']);
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
          postInArray.imagePath = '';
          // imagePath will be adapted later
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
