import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule,ToastModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css',
  providers: [MessageService]
})
export class NewPasswordComponent implements OnInit {
  resetForm: FormGroup;
  userId: string | undefined;
  token: string | undefined;
  private tokenExpirationTime = 15 * 60 * 1000;
  private apiUrl = 'https://sellingthingsapi.shop/api';
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.userId = params['userId'];
      this.token = params['token'];
            // Check token validity
            const storedToken = localStorage.getItem('resetToken');
            const storedUserId = localStorage.getItem('resetUserId');
            const storedTime = localStorage.getItem('resetTime');
            const currentTime = new Date().getTime();
      
            if (storedToken !== this.token || storedUserId !== this.userId || !storedTime || (currentTime - parseInt(storedTime)) > this.tokenExpirationTime) {
              // Redirect to an error page or show a message
              this.router.navigate(['/']);
            } else {
              // Update the token expiration time
              localStorage.setItem('resetTime', currentTime.toString());
            }
    });
  }
  getError(controlName: string, errorName: string): boolean {
    const control = this.resetForm.get(controlName);
    return control?.hasError(errorName) && control?.touched ? true : false;
  }
  async onSubmit(): Promise<void>  {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.newPassword;
      const confirmPassword = this.resetForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        alert("Parolalar eşleşmiyor");
        return;
      }
      try {
        // 1. Kullanıcıyı GET isteği ile alma
        const userResponse = await axios.get(`${this.apiUrl}/User/GetAsync?id=${this.userId}`);

        const user = userResponse.data;

        // 2. Kullanıcıyı güncelleme
        const updateResponse = await axios.put(`${this.apiUrl}/User/UpdateAsync`, {
          id: user.id,
          name: user.name, // Kullanıcıyı GET isteğinden al
          surname: user.surname, // Kullanıcıyı GET isteğinden al
          mail: user.mail, // Kullanıcıyı GET isteğinden al
          password: newPassword
        });
        
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Şifre güncelleme işlemi başarılı!' });
        setTimeout(() => {
          localStorage.removeItem('resetToken');
        localStorage.removeItem('resetUserId');
        localStorage.removeItem('resetTime');
        this.router.navigate(['/login']);

        }, 1500);
        
      } catch (error) {
        console.error('Kullanıcı güncellenmesi hatası', error);
      }
    }
  }
}
