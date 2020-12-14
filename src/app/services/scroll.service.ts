import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private requestAnimationFrame = null;
  private from = 0;
  private to = 0;
  private direction = 1;
  private distance = 0;
  private current = 0;
  private duration = 0;
  private startTime = null;

  constructor() {
    this.requestAnimationFrame = (
      (window as any).requestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame
    );
  }

  public animate(from: number, to: number, duration = 500) {
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.direction = to > from ? 1 : -1;
    this.distance = (to - from) * this.direction;
    this.current = from;

    if(this.requestAnimationFrame) {
      this.requestAnimationFrame(timestamp => {
        this.startTime = timestamp;
        this.animationStep(timestamp)
      });
    } else {
      window.scrollTo(0, this.to);
    }
  }

  private animationStep(timestamp) {
    const runtime = timestamp - this.startTime;
    const progress = runtime / this.duration

    window.scrollTo(0, this.from + (this.distance * progress) * this.direction);

    if(runtime < this.duration) {
      this.requestAnimationFrame(timestamp => this.animationStep(timestamp));
    } else {
      window.scrollTo(0, this.to);
    }
  }
}
