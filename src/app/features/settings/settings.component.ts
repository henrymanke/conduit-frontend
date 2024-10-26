import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../core/models/user.model";
import { UserService } from "../../core/services/user.service";
import { ListErrorsComponent } from "../../shared/components/list-errors.component";
import { Errors } from "../../core/models/errors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface SettingsForm {
  image: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings.component.html",
  imports: [ListErrorsComponent, ReactiveFormsModule],
  standalone: true,
})
export default class SettingsComponent implements OnInit {
  user!: User;
  settingsForm = new FormGroup<SettingsForm>({
    image: new FormControl("", { nonNullable: true }),
    username: new FormControl("", { nonNullable: true }),
    bio: new FormControl("", { nonNullable: true }),
    email: new FormControl("", { nonNullable: true }),
    password: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  errors: Errors | null = null;
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User | null) => {
        if (user) {
          this.settingsForm.patchValue(user);
        }
      });
  }
  

  logout(): void {
    this.userService.logout();
  }

  submitForm() {
    this.isSubmitting = true;

    // Log the form values to ensure the image URL is included
    // console.log(this.settingsForm.value);

    this.userService
      .update(this.settingsForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user }) => {
          // console.log('API response:', user);  // Log the response to check the updated user data
          void this.router.navigate(["/profile/", user.username]);
        },
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
          // console.error('Update error:', err);  // Log the error if the update fails
        },
      });
  }
}
