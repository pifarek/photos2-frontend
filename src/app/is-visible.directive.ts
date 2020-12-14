import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appIsVisible]'
})
export class IsVisibleDirective implements AfterViewChecked {

  @HostListener('window:scroll', ['$event']) private onScroll($event:Event):void {
    if(this.isElementInViewport()) {
      this.addClass();
    }
  };

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  public ngAfterViewChecked() {
    if(this.isElementInViewport()) {
      this.addClass();
    }
  }

  private addClass() {
    if(!this.element.nativeElement.classList.contains('open')) {
      this.renderer.addClass(this.element.nativeElement, 'in-viewport');
    }
  }

  private isElementInViewport() {
    let rect = this.element.nativeElement.getBoundingClientRect();

    const clientHeight = (window.innerHeight || document.documentElement.clientHeight);
    const clientWidth = (window.innerWidth || document.documentElement.clientWidth);

    if(clientHeight && clientWidth && rect.top && rect.left && rect.bottom && rect.right) {
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <= clientHeight &&
        rect.right <= clientWidth
      );
    }

    return false;
  }
}
