import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appMouseMove]'
})
export class MouseMoveDirective {
  @Input('appMouseMove') options: {timeout: number, classIn: string, classOut: string} = {timeout: 5, classIn: 'visible', classOut: 'hidden'};

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.lastMouseMove = new Date().getTime();
  };

  private lastMouseMove = null;

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.lastMouseMove = new Date().getTime();

    setInterval(() => this.checkTime(), 200);
  }

  private checkTime() : void {
    const currentTime = new Date().getTime();

    if(currentTime > this.lastMouseMove + (this.options.timeout * 1000)) {
      this.renderer.removeClass(this.element.nativeElement, this.options.classIn);
      this.renderer.addClass(this.element.nativeElement, this.options.classOut);
    } else {
      this.renderer.removeClass(this.element.nativeElement, this.options.classOut);
      this.renderer.addClass(this.element.nativeElement, this.options.classIn);
    }
  }

}
