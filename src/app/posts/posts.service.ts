import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendPost, Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private postsData$$ = new BehaviorSubject<{
    posts: Post[];
    maxPosts: number;
  } | null>(null);

  get postsData$() {
    return this.postsData$$.asObservable();
  }

  get posts() {
    return this.postsData$$.value?.posts;
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  // getPosts() {
  //   this.httpClient
  //     .get<{ message: string; posts: BackendPost[]; maxPosts: number }>(
  //       'http://localhost:3000/api/posts'
  //     )
  //     .pipe(
  //       map(
  //         (postData: {
  //           message: string;
  //           posts: BackendPost[];
  //           maxPosts: number;
  //         }) => {
  //           return {
  //             posts: postData.posts.map((post: BackendPost) => {
  //               return {
  //                 title: post.title,
  //                 content: post.content,
  //                 id: post._id,
  //                 imagePath: post.imagePath,
  //               } as Post;
  //             }),
  //             maxPosts: postData.maxPosts,
  //           };
  //         }
  //       )
  //     )
  //     .subscribe((postData: { posts: Post[]; maxPosts: number }) => {
  //       this.postsData$$.next(postData);
  //     });
  // }

  getPosts(postsPerPage?: number, currentPage?: number) {
    if (!Boolean(postsPerPage && currentPage)) {
      postsPerPage = 10;
      currentPage = 1;
    }
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: BackendPost[]; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.postsData$$.next(transformedPostData);
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
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }

    this.httpClient
      .put<{ message: string; post: BackendPost }>(
        `http://localhost:3000/api/posts/${id}`,
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }
}
