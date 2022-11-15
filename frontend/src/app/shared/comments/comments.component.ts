import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Comment, User } from '../../core';
import { CommentsService, UserService } from '../../core/services';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  newComment!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _commentsService: CommentsService,
    private cd: ChangeDetectorRef,

  ) {
    this.newComment = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  private subscription!: Subscription

  listComments: Comment[] = [];
  comments: any;
  loaded: boolean = false;
  @Input() slug: string = "";

  user!: string;

  ngOnInit() {
    console.log(this.slug);
    if (this.slug) {
      this.loadComments();
    }
    // Load the current user's data
    this.subscription = this._userService.currentUser.subscribe(
      (userData: User) => {
        this.user = userData.username;
      }
    );
  }

  loadComments() {
    this._commentsService.getAll(this.slug).subscribe(data => {
      this.comments = data;
      this.listComments = this.comments.comments;
    });
  }

  addComment() {
    this._commentsService.add(this.slug, this.newComment.value).subscribe(data => {
      this.loadComments();
    });
  }

  deleteComment(commentId: any) {
    this._commentsService.delete(this.slug, commentId).subscribe(data => {
      this.loadComments();
    });

  }

}
