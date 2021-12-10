import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode: 'edit' | 'create' = 'create';
  private postId: string | null = null;
  private currentPost: Post | null = null;

  constructor(
    public postsService: PostsService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.currentPost = this.postsService.getPost(this.postId!);
      } else {
        this.mode = 'create';
        this.postId = null;
        this.currentPost = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
