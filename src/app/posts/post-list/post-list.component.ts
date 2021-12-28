import { ChangeDetectorRef, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  currentUserId: string | undefined = this.authService.currentUserId;
  isLoading = true;
  postsData$ = this.postsService.postsData$;
  pageSize = 2;
  currentPage = 1;

  isAuthenticated$ = this.authService.isAuthenticated$.pipe(
    tap(() => {
      this.currentUserId = this.authService.currentUserId;
    })
  );

  constructor(
    private postsService: PostsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.isLoading = false;
        this.postsService.getPosts(this.pageSize, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPaginatorChange(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex + 1;
  }
}
