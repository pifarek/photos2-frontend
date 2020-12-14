import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IndexComponent} from "../index/index.component";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit, AfterViewInit {

  @ViewChild('sectionHome') sectionHome: ElementRef;
  @ViewChild('introVideo') videoElement: ElementRef;

  constructor(private index: IndexComponent) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // We have to start this Video here for browsers that don't allow autoplay :(
    this.videoElement.nativeElement.muted = true;
    this.videoElement.nativeElement.autoplay = true;
    // Pass section to parent component
    this.index.elements.push({name: 'home', element: this.sectionHome});
  }

  public scrollToMedia(event: MouseEvent) {
    this.index.scroll(event, 'media');
  }
}
