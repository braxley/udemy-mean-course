import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  private postId: string | null = null;

  constructor(
    public postsService: PostsService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
  }

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
            console.log(backendPost);
            this.currentPost = {
              id: backendPost._id,
              title: backendPost.title,
              content: backendPost.content,
            } as Post;
            this.form.setValue({
              title: this.currentPost.title,
              content: this.currentPost.content,
            });
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.currentPost = null;
      }
    });
  }

  onSubmitPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.mode === 'create'
      ? this.postsService.addPost(
          this.form.value.title,
          this.form.value.content
        )
      : this.postsService.updatePost(
          this.currentPost!.id!,
          this.form.value.title,
          this.form.value.content
        );
    this.router.navigate(['/']);
    this.form.reset();
  }
}
