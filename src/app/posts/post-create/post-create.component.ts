import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { tap } from 'rxjs';
import { BackendPost, Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  filePreview: string | null = null;
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
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
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
            this.currentPost = {
              id: backendPost._id,
              title: backendPost.title,
              content: backendPost.content,
              imagePath: backendPost.imagePath,
              creator: backendPost.creator,
            } as Post;
            this.form.setValue({
              title: this.currentPost.title,
              content: this.currentPost.content,
              image: this.currentPost.imagePath,
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

  onChangeImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview = reader.result as string;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.filePreview = null;
    }
  }

  onSubmitPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.mode === 'create'
      ? this.postsService.addPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
      : this.postsService.updatePost(
          this.currentPost!.id!,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
    this.router.navigate(['/']);
    this.form.reset();
  }
}
