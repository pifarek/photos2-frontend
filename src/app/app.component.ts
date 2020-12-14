import {Component, HostListener, Renderer2} from '@angular/core';
import {IntroComponent} from "./components/intro/intro.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isFixed = true;

  @HostListener('window:scroll', ['$event']) onScroll() {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    const windowHeight = window.innerHeight;

    if(verticalOffset >= windowHeight) {
      this.renderer.addClass(document.body, 'is-fixed');
    } else {
      this.renderer.removeClass(document.body, 'is-fixed');
    }
  }

  constructor(private renderer: Renderer2) {

  }
}
