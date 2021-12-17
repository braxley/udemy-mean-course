import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;

  onSubmitLoginForm(form: FormGroup) {
    console.dir(form);
  }
}
