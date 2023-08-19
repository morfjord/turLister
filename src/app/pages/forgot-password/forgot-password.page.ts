import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  resetForm: FormGroup;
  passwordForm: FormGroup;
  constructor(private apiService: ApiService, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.resetForm = this.getResetFormGroup();
    this.passwordForm = this.getPasswordFormGroup();
  }

  ngOnInit() {
  }

  getResetFormGroup() {
    return new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }
  getPasswordFormGroup() {
    return new FormGroup({
      code: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });
  }
  onResetSubmit() {
    this.apiService.resetPassword(this.resetForm.value.email).subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'sendt tilbakestillingskode',
        duration: 2000
      });
      toast.present();
    }, err => {
      this.showError(err);
    })
  }
  onPasswordSubmit() {

  }
  async showError(err) {
    const alert = await this.alertCtrl.create({
      header: err.error.code,
      subHeader: err.error.data.status,
      message: err.error.message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
