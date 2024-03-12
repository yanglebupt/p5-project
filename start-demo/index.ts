import { Circle, Sketch } from "@ylbupt/p5-project";
import { Vector } from "p5";

export class MainSketch extends Sketch {
  setup() {
    super.setup();
    this.createCanvas(300, 300);
    this.scene.add(new Circle(new Vector(100, 100), 20));
    console.log(this.width);
    this.frameRate(80);
  }
  draw() {
    this.clear();
    this.background(0);
    this.scene.draw();
  }
}
