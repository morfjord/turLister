import { AnimationController, Animation } from '@ionic/angular';

export const enterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const DURATION = 500;
  const animationCtrl = new AnimationController();
  if (opts.direction === 'forward') {
    return animationCtrl.create()
      .addElement(opts.enteringEl)
      .duration(DURATION)
      .easing('ease-in')
      .fromTo('opacity', 0, 1);
  } else {
    const rootAnimation = animationCtrl.create()
      .addElement(opts.enteringEl)
      .duration(DURATION)
      .easing('ease-in')
      .fromTo('opacity', 0, 1);
    const leavingAnimation = animationCtrl.create()
      .addElement(opts.leavingEl)
      .duration(DURATION)
      .easing('ease-out')
      .fromTo('opacity', 1, 0);
    return animationCtrl.create().addAnimation([rootAnimation, leavingAnimation]);
  }
}

export const myEnterAnimation = (baseEl: HTMLElement): Animation => {

  const baseAnimation = new AnimationController();

  const backdropAnimation = baseAnimation.create()
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = baseAnimation.create()
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation
    .fromTo('transform', 'scaleX(0.1) scaleY(0.1)', 'translateX(0%) scaleX(1) scaleY(1)')
    .fromTo('opacity', 0, 1);

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return baseAnimation.create()
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(400)
    .beforeAddClass('show-modal')
    .addAnimation(backdropAnimation)
    .addAnimation(wrapperAnimation);

}

export const myLeaveAnimation = (baseEl: HTMLElement): Animation => {

  const baseAnimation = new AnimationController();
  const backdropAnimation = baseAnimation.create()
    .addElement(baseEl.querySelector('ion-backdrop'))


  const wrapperAnimation = baseAnimation.create();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation
    .fromTo('transform', 'scaleX(1) scaleY(1)', 'scaleX(0.1) scaleY(0.1)')
    .fromTo('opacity', 1, 0);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return baseAnimation.create()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(250)
    .addAnimation(backdropAnimation)
    .addAnimation(wrapperAnimation)
    ;
}