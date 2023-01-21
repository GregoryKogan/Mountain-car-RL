import type { p5Interface } from "@/components/SketchComponent.vue";

export class MountainCarEnvironment {
  minPosition: number;
  maxPosition: number;
  maxSpeed: number;
  goalPosition: number;
  goalVelocity: number;
  gravity: number;
  carWidth: number;
  carHeight: number;
  force: number;
  friction: number;
  position: number;
  velocity: number;
  p5: p5Interface;
  constructor(p5: p5Interface) {
    this.p5 = p5;

    this.minPosition = -1.2;
    this.maxPosition = 0.6;
    this.maxSpeed = 0.07;
    this.goalPosition = 0.5;
    this.goalVelocity = 0;
    this.gravity = 0.0025;
    this.carWidth = 0.2;
    this.carHeight = 0.1;
    this.force = 0.0013;
    this.friction = 0.98;

    this.position = 0;
    this.velocity = 0;

    this.setRandomState();
  }

  setRandomState(): void {
    this.position = Math.random() / 5 - 0.6;
    this.velocity = 0;
  }

  controlKeyboard(): void {
    let action = 0;
    if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) action += 1;
    if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) action -= 1;
    this.update(action);
  }

  update(action: number): boolean {
    this.velocity *= this.friction;

    this.velocity +=
      action * this.force - Math.cos(3 * this.position) * this.gravity;
    this.velocity = Math.min(
      Math.max(this.velocity, -this.maxSpeed),
      this.maxSpeed
    );

    this.position += this.velocity;
    this.position = Math.min(
      Math.max(this.position, this.minPosition),
      this.maxPosition
    );

    if (this.position == this.minPosition && this.velocity < 0)
      this.velocity = 0;

    return this.isDone();
  }

  isDone(): boolean {
    return (
      this.position >= this.goalPosition && this.velocity >= this.goalVelocity
    );
  }

  envToScreenCoords(x: number, y: number): [number, number] {
    const screenX = this.p5.map(
      x,
      this.minPosition,
      this.maxPosition,
      0,
      this.p5.width
    );
    const screenY = this.p5.map(
      y,
      -1,
      1,
      this.p5.height * 0.95,
      this.p5.height * 0.2
    );

    return [screenX, screenY];
  }

  renderRoad(): void {
    this.p5.push();
    this.p5.stroke("#7aa2f7");
    this.p5.strokeWeight(3);

    let previousPoint = null;
    for (let x = this.minPosition; x <= this.maxPosition; x += 0.001) {
      const y = Math.sin(3 * x);
      const [screenX, screenY] = this.envToScreenCoords(x, y);
      if (previousPoint)
        this.p5.line(previousPoint.x, previousPoint.y, screenX, screenY);
      previousPoint = { x: screenX, y: screenY };
    }
    this.p5.pop();
  }

  roadInclineAt(x: number): number {
    const [x1, y1] = this.envToScreenCoords(
      x - 0.001,
      Math.sin(3 * (x - 0.001))
    );
    const [x2, y2] = this.envToScreenCoords(
      x + 0.001,
      Math.sin(3 * (x + 0.001))
    );

    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx / dy;
  }

  inclineToAngle(k: number): number {
    let angle = Math.atan2(10, k * 10);
    if (k < 0) angle += Math.PI;
    return angle;
  }

  gradientAt(x: number): number {
    const y1 = this.envToScreenCoords(x - 0.001, Math.sin(3 * (x - 0.001)))[1];
    const y2 = this.envToScreenCoords(x + 0.001, Math.sin(3 * (x + 0.001)))[1];
    return y2 - y1;
  }

  renderWheel(x: number, radius: number): void {
    const [screenX, screenY] = this.envToScreenCoords(x, Math.sin(3 * x));

    this.p5.push();
    this.p5.fill("#414868");
    this.p5.stroke("#bb9af7");
    this.p5.strokeWeight(radius / 5);
    this.p5.translate(screenX, screenY);
    this.p5.rotate(this.inclineToAngle(this.roadInclineAt(x)));
    this.p5.circle(0, -radius, radius * 2 - radius / 5);
    this.p5.fill("#1a1b26");
    this.p5.noStroke();
    this.p5.circle(0, -radius, (radius / 3) * 2);
    this.p5.pop();
  }

  renderCar(): void {
    const totalTrackLen = this.maxPosition - this.minPosition;

    const screenCarWidth = (this.carWidth * this.p5.width) / totalTrackLen;
    const screenCarHeight = (screenCarWidth * this.carHeight) / this.carWidth;
    const [screenX, screenY] = this.envToScreenCoords(
      this.position,
      Math.sin(3 * this.position)
    );

    this.p5.push();
    this.p5.stroke("#414868");
    this.p5.strokeWeight(screenCarHeight / 20);
    this.p5.fill("#ff9e64");
    this.p5.translate(screenX, screenY);
    this.p5.rotate(this.inclineToAngle(this.roadInclineAt(this.position)));
    this.p5.rect(
      -screenCarWidth / 2,
      -screenCarHeight - screenCarHeight / 4,
      screenCarWidth,
      screenCarHeight - screenCarHeight / 8,
      screenCarHeight / 4
    );
    this.p5.fill("#b4f9f8");
    this.p5.stroke("#1a1b26");
    this.p5.strokeWeight(screenCarHeight / 3 / 5);
    this.p5.circle(
      screenCarWidth / 2 - screenCarWidth / 6,
      -screenCarHeight + screenCarHeight / 10,
      screenCarHeight / 3
    );
    this.p5.pop();

    const wheelOffset =
      (this.carWidth *
        Math.cos(this.inclineToAngle(this.roadInclineAt(this.position)))) /
      4;
    this.renderWheel(this.position + wheelOffset, screenCarHeight / 3);
    this.renderWheel(this.position - wheelOffset, screenCarHeight / 3);
  }

  renderFlag(): void {
    const [x, y] = this.envToScreenCoords(
      this.goalPosition,
      Math.sin(3 * this.goalPosition)
    );

    this.p5.push();
    this.p5.stroke("#c0caf5");
    this.p5.strokeWeight(4);
    this.p5.fill("#f7768e");
    this.p5.line(x, y - 2, x, y - this.p5.height * 0.15);
    this.p5.noStroke();
    this.p5.triangle(
      x,
      y - this.p5.height * 0.15,
      x,
      y - this.p5.height * 0.1,
      x - this.p5.width / 30,
      y - this.p5.height * 0.125
    );
    this.p5.pop();
  }

  render(): void {
    this.renderCar();
    this.renderFlag();
    this.renderRoad();
  }
}
