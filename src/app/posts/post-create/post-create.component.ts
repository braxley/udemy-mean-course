import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { tap } from 'rxjs';
import { BackendPost, Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  currentPost: Post | null = null;
  mode: 'edit' | 'create' = 'create';
  isLoading = false;
  private postId: string | null = null;

  constructor(
    public postsService: PostsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService
          .getPost(this.postId!)
          .pipe(
            tap(() => {
              this.isLoading = true;
            })
          )
          .subscribe((backendPost: BackendPost) => {
            const loadedPost = {
              id: backendPost._id,
              title: backendPost.title,
              content: backendPost.content,
            } as Post;
            this.currentPost = loadedPost;
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.currentPost = null;
      }
    });
  }

  onSubmitPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.mode === 'create'
      ? this.postsService.addPost(form.value.title, form.value.content)
      : this.postsService.updatePost(
          this.currentPost!.id!,
          form.value.title,
          form.value.content
        );
    this.router.navigate(['/']);
    form.resetForm();
  }
}
