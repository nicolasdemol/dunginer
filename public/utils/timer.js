export class Timer {
  constructor(duration) {
    this.duration = duration;
    this.elapsed = 0;
    this.active = false;
  }

  start() {
    this.elapsed = 0;
    this.active = true;
  }

  update(deltaTime) {
    if (!this.active) return;
    this.elapsed += deltaTime;
    if (this.elapsed >= this.duration) {
      this.active = false;
    }
  }

  reset() {
    this.elapsed = 0;
    this.active = true;
  }

  isFinished() {
    return !this.active;
  }

  getRemainingTime() {
    return Math.max(0, this.duration - this.elapsed);
  }
}
