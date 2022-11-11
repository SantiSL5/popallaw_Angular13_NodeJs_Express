import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Comment, User } from '../../core';
import { CommentsService } from '../../core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit {
  constructor(
    private _commentsService: CommentsService,
    private cd: ChangeDetectorRef,

  ) { }

  private subscription!: Subscription

  listComments: Comment[] = [];
  comments: any;
  loaded: boolean = false;
  @Input() slug: string = "";

  canModify!: boolean;

  ngOnInit() {
    this.loadComments(this.slug);
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
      this.comments = data;
      this.listComments = this.comments.comments;
    });
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  deleteClicked() {
    // this.deleteComment.emit(true);
  }

}
