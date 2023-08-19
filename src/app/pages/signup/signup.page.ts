import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  registerForm: FormGroup;
  constructor(private apiService: ApiService, private alertCtrl: AlertController, private toastCtrl: ToastController, private navCtrl: NavController) {
    this.registerForm = this.getRegisterFormGroup();
  }

  ngOnInit() {
  }
  getRegisterFormGroup() {
    return new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      confirm_password: new FormControl('', Validators.compose([Validators.required, confirmPasswordValidator])),
      isAcceptTermsConditions: new FormControl(false, Validators.requiredTrue)
    });
  }

  onRegisterSubmit() {
    if (!this.registerForm.invalid) {
      let newUSer = {
        uName: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        fName: this.registerForm.value.firstname,
        lName: this.registerForm.value.lastname
      }
      this.apiService.doSignupInWordpress(newUSer).subscribe(async (res: any) => {
        if (res.status === false) {
          const toast = await this.toastCtrl.create({
            message: res.result[0],
            duration: 3000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: res.result[0],
            duration: 3000
          });
          toast.present();
          this.registerForm.reset();
          this.navCtrl.navigateForward(['/login']);
        }
      }, e => {
        this.showError(e);
      })
    }
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

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) { return null; }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('confirm_password');

  if (!password || !passwordConfirm) { return null; }

  if (passwordConfirm.value === '') { return null; }

  if (password.value === passwordConfirm.value) { return null; }

  return { passwordsNotMatching: true };
};

