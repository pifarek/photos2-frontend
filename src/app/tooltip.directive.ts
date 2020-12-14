import {Directive, ElementRef, Input, OnInit, Renderer2, HostListener, Inject} from '@angular/core';

enum Direction {
  LEFT,
  RIGHT
}

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit{

  @Input('appTooltip') text: string;
  @Input('tooltipRoot') root: Element;

  private div: Element;
  private direction = Direction.RIGHT;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  private createDiv() : Element {
    let div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'tooltipHover');
    this.renderer.appendChild(this.root, div);
    return div;
  }

  private setPosition() : void {
    const tooltipDimensions = this.getTooltipDimensions();
    const elementDimensions = this.getElementDimensions();
    const rootDimensions = this.getRootDimensions();

    if(elementDimensions.left > rootDimensions.width / 2) {
      this.direction = Direction.LEFT;
    } else {
      this.direction = Direction.RIGHT;
    }

    this.renderer.setStyle(this.div, 'top', (elementDimensions.height + 4 + elementDimensions.top) + 'px');
    if(this.direction === Direction.RIGHT) {
      this.renderer.setStyle(this.div, 'left', (elementDimensions.width + (elementDimensions.left / 2)) + 'px');
    } else {
      this.renderer.setStyle(this.div, 'left', (elementDimensions.left - tooltipDimensions.width + elementDimensions.width / 2) + 'px');
    }
  }

  private getTooltipDimensions() : {width: number, height: number} {
    return {width: this.div.getBoundingClientRect().width, height: this.div.getBoundingClientRect().height}
  }

  private getElementDimensions() : {top: number, left: number, width: number, height: number} {
    const top = this.element.nativeElement.getBoundingClientRect().top;
    const left = this.element.nativeElement.getBoundingClientRect().left;
    const width = this.element.nativeElement.getBoundingClientRect().width;
    const height = this.element.nativeElement.getBoundingClientRect().height;

    return {top: top, left: left,  width: width, height: height}
  }

  private getRootDimensions() : {width: number, height: number} {
    return {width: this.root.getBoundingClientRect().width, height: this.root.getBoundingClientRect().height};
  }

  private showTooltip() : void {
    this.renderer.addClass(this.div, 'tooltipVisible');
    if(this.direction === Direction.LEFT) {
      this.renderer.addClass(this.div, 'tooltipLeft');
    }
  }

  public hideTooltip() : void {
    this.renderer.removeClass(this.div, 'tooltipVisible');
    this.renderer.removeClass(this.div, 'tooltipLeft');
  }

  ngOnInit(): void {
    this.div = this.createDiv();
    this.renderer.appendChild(this.div, this.renderer.createText(this.text));
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setPosition();
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  /**
   * We should hide visible element on click
   */
  @HostListener('click') onClick() {
    this.hideTooltip();
  }
}
