import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Comment, User } from '../../core';
import { CommentsService } from '../../core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit, OnDestroy {
  constructor(
    private _commentsService: CommentsService,
    private cd: ChangeDetectorRef,

  ) { }

  private subscription!: Subscription

  comment!: Comment;
  @Output() deleteComment = new EventEmitter<boolean>();

  canModify!: boolean;

  ngOnInit() {
    // Load the current user's data
    // this.subscription = this._userService.currentUser.subscribe(
    //   (userData: User) => {
    //     console.log(userData);

    //     this.canModify = (userData.username === this.comment.author.username);
    //   }
    // );
  }

  loadComments(slug: string) {
    this._commentsService.getAll(slug).subscribe(data => {
      this.comment = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteClicked() {
    this.deleteComment.emit(true);
  }

}
