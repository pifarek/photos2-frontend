import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IndexComponent} from "../index/index.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  @ViewChild('sectionContact') section: ElementRef;

  public form: FormGroup;
  public sent = false;

  constructor(private index: IndexComponent, private api: ApiService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
    });
  }

  ngAfterViewInit() {
    // Pass section to parent component
    this.index.elements.push({name: 'contact', element: this.section});
  }

  message(event: Event)
  {
    event.preventDefault();

    if(this.form.valid) {
      for(const control in this.form.controls) {
        this.form.get(control).disable();
      }
      this.api.postMessage(this.form.get('name').value, this.form.get('email').value, this.form.get('message').value).subscribe(() => {
        this.sent = true;
        for(const control in this.form.controls) {
          this.form.get(control).enable();
        }
      });
    }
  }
}
