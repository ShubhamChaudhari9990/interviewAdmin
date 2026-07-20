import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  login() {

    this.auth.login(this.email, this.password)
      .then(() => {
        alert('Login Successful');
        this.router.navigate(['/admin']);
      })
      .catch(error => {
        alert(error.message);
      });

  }
}
