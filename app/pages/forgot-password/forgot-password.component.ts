import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '../../services/mail/mail.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private forgotPasswordService: MailService,
    private router: Router
  ) {}

  sendResetLink() {
    if (this.email) {
      this.forgotPasswordService.sendPasswordResetLink(this.email)
        .then(() => {
          alert('Şifre sıfırlama bağlantısı gönderildi.');
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        });
    } else {
      alert('Lütfen geçerli bir email adresi giriniz.');
    }
  }
}
