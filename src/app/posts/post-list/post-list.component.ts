import { ChangeDetectorRef, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  isLoading = true;
  posts$ = this.postsService.posts$;
  pageSize = 10;
  pageIndex = 0;

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

  onPaginatorChange(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
  }
}
