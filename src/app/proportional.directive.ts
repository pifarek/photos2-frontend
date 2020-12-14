import {AfterViewChecked, Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appProportional]'
})
export class ProportionalDirective implements AfterViewChecked{

  @Input('appProportional') appProportional: number;

  constructor(private element: ElementRef, private renderer: Renderer2) {
    if(!this.appProportional) {
      this.appProportional = 1;
    }
  }

  ngAfterViewChecked(): void {
    const width = this.element.nativeElement.offsetWidth;
    const height = width * this.appProportional;

    console.log(height);
    console.log(this.appProportional);

    // Set new height
    this.renderer.setStyle(this.element.nativeElement, 'height', height + 'px');
  }

}
