import { Component, Input } from "@angular/core";
import { Article } from "../models/article.model";
import { ArticleMetaComponent } from "./article-meta.component";
import { RouterLink } from "@angular/router";
import { NgForOf } from "@angular/common";
import { FavoriteButtonComponent } from "./favorite-button.component";

@Component({
  selector: "app-article-preview",
  template: `
    <div class="article-preview card mb-3">
      <div class="card-body shadow-sm">
        <!-- Article Meta with Favorite Button -->
        <app-article-meta [article]="article" class="mb-3">
          <app-favorite-button
            [article]="article"
            (toggle)="toggleFavorite($event)"
            class="float-end"
          >
            <i class="bi bi-suit-heart-fill"></i> {{ article.favoritesCount }}
          </app-favorite-button>
        </app-article-meta>

        <!-- Article Link -->
        <a [routerLink]="['/article', article.slug]" class="preview-link text-decoration-none">
          <h2 class="card-title">{{ article.title }}</h2>
          <p class="card-text text-muted fw-light">{{ article.description }}</p>
          <span class="text-primary fw-lighter float-end ">read more...</span>

          <!-- Tag List -->
          <ul class="tag-list list-inline mb-0">
            <li class="list-inline-item badge rounded-pill bg-primary-subtle text-primary" *ngFor="let tag of article.tagList">
              #{{ tag }}
            </li>
          </ul>
        </a>
      </div>
    </div>
  `,
  imports: [ArticleMetaComponent, FavoriteButtonComponent, RouterLink, NgForOf],
  standalone: true,
})
export class ArticlePreviewComponent {
  @Input() article!: Article;

  toggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }
}
