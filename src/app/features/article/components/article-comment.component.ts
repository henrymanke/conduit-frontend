import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { UserService } from "../../../core/services/user.service";
import { User } from "../../../core/models/user.model";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { Comment } from "../models/comment.model";
import { AsyncPipe, DatePipe, NgIf } from "@angular/common";

@Component({
  selector: "app-article-comment",
  template: `
    @if (comment) {
      <div class="card mb-3">
        <div class="card-body">
          <p class="card-text">
            {{ comment.body }}
          </p>
        </div>
        <div class="card-footer d-flex align-items-center">
          <!-- Comment author image -->
          <a
            class="comment-author me-2"
            [routerLink]="['/profile', comment.author.username]"
          >
            <img
              [src]="comment.author.image"
              class="rounded-circle"
              style="width: 30px; height: 30px;"
              alt="Author's profile picture"
            />
          </a>
          
          <!-- Comment author name -->
          <a
            class="comment-author fw-bold me-auto"
            [routerLink]="['/profile', comment.author.username]"
          >
            {{ comment.author.username }}
          </a>

          <!-- Date posted -->
          <span class="text-muted me-3">
            {{ comment.createdAt | date: 'longDate' }}
          </span>

          <!-- Trash icon for deleting the comment, only shown if canModify is true -->
          @if (canModify$ | async) {
            <span class="mod-options">
              <i
                class="bi bi-trash-fill text-danger"
                style="cursor: pointer;"
                (click)="delete.emit(true)"
                title="Delete comment"
              ></i>
            </span>
          }
        </div>
      </div>
    }
  `,
  imports: [RouterLink, DatePipe, NgIf, AsyncPipe],
  standalone: true,
})
export class ArticleCommentComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<boolean>();

  canModify$ = inject(UserService).currentUser.pipe(
    map(
      (userData: User | null) =>
        userData?.username === this.comment.author.username,
    ),
  );
}
