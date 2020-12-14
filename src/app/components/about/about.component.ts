import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IndexComponent} from "../index/index.component";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  @ViewChild('sectionAbout') section: ElementRef;

  constructor(private index: IndexComponent) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Pass section to parent component
    this.index.elements.push({name: 'about', element: this.section});
  }
}
