import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Article } from "../models/article.model";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-article-meta",
  template: `
    <div class="d-flex align-items-center mb-2 article-meta">
      <a [routerLink]="['/profile', article.author.username]">
        <img
          [src]="article.author.image"
          alt="{{ article.author.username }}'s profile picture"
          class="rounded-circle me-2 shadow-sm"
          style="width: 48px; height: 48px;"
        />
      </a>

      <div class="info me-auto d-flex flex-column">
        <a class="author fw-medium text-decoration-none" [routerLink]="['/profile', article.author.username]">
          {{ article.author.username }}
        </a>
        <span class="date text-muted fw-lighter">
          {{ article.createdAt | date: "shortDate" }}

        </span>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  standalone: true,
})
export class ArticleMetaComponent {
  @Input() article!: Article;
}
