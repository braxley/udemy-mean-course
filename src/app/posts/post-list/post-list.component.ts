import { ChangeDetectorRef, Component } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  isLoading = true;
  posts$ = this.postsService.posts$;

  constructor(
    public postsService: PostsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onDeletePost(postId: string) {
    this.postsService.deletePost(postId);
  }
}
