import { Component,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterModule,Router} from '@angular/router';
import { Toast, ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AbstractControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule,CommonModule,ReactiveFormsModule,ToastModule],
  providers: [MessageService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInComponent {
   registrationForm: FormGroup;
   isLoading: boolean = false;

    constructor(private fb: FormBuilder, 
      private messageService: MessageService,
      private userService: UserService,
      private router: Router,
    ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  };
  onSubmit() {
    
    if (this.registrationForm.valid) {
      this.isLoading = true;
      const formValue = this.registrationForm.value;
      const user = {
        id: 0,
        name: formValue.name,
        surname: formValue.surname,
        mail: formValue.email,
        password: formValue.password
      };
      this.userService.createUser(user)
        .then(response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kayıt işlemi başarılı!' });
          setTimeout(() => {
            this.registrationForm.reset();
            this.isLoading = false;
            this.router.navigate(['/login']);
          }, 1800); 
        })
        .catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.response.data.message });
          this.isLoading = false;
        });

    }

  };


}
