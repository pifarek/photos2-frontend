import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @ViewChild('navbar') navbar: ElementRef;
  public elements: {name: string, element: ElementRef}[] = [];
  public date = new Date();
  public displayNavbar = false;
  public activeElement = 'home';

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const scrollTop = window.scrollY;

    this.elements.forEach(item => {
      const top = item.element.nativeElement.offsetTop;
      const bottom = top + item.element.nativeElement.offsetHeight;

      if(scrollTop >= top && scrollTop < bottom) {
        this.activeElement = item.name;
      }
    })
  }

  constructor(private scrollService: ScrollService) { }

  ngOnInit(): void {
  }

  public toggleNavbar(event: MouseEvent) : void {
    event.preventDefault();

    this.displayNavbar = !this.displayNavbar;
  }

  /**
   * Scroll to the selected Section
   * @param event
   * @param name
   */
  public scroll(event: MouseEvent, name: string) {
    event.preventDefault();
    this.displayNavbar = false;

    this.elements.forEach(item => {
      if(item.name === name) {
        const itemOffsetTop = item.element.nativeElement.offsetTop;
        const navHeight = this.navbar.nativeElement.offsetHeight;

        this.animateScroll(window.scrollY, itemOffsetTop);
      }
    })
  }

  /**
   * Call scrolling service
   * @param from
   * @param to
   */
  private animateScroll(from: number, to: number) {
    this.scrollService.animate(from, to);
  }
}
