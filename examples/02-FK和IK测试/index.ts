import { Sketch } from "@ylbupt/p5-project";
import { Element, Vector } from "p5";
import { FKConeBone, ForwardKinematics } from "./ForwardKinematics";
import { IKConeBone, InverseKinematics } from "./InverseKinematics";

export class Sketch02 extends Sketch {
  private fk: ForwardKinematics = new ForwardKinematics();
  private dir: number = 1;
  public setup(): void {
    super.setup();
    this.scene.add(this.fk); // 1. 添加到场景
    for (let i = 0; i < 5; i++) {
      this.fk.addLink(
        new FKConeBone(new Vector(100, 100), i * this.p5.QUARTER_PI, 50)
      );
    }
    this.p5.createCanvas(300, 300);
    this.p5.background(125);
    this.p5.createDiv("ForwardKinematics").position(0, 0);
  }
  public draw(): void {
    if (
      this.fk.segments[2].angle >= (3.2 * Math.PI) / 4 ||
      this.fk.segments[2].angle <= 0
    ) {
      this.dir *= -1;
    }
    this.fk.rotate(this.dir * Math.PI * 0.005, 2); // 2. 改变
    this.p5.clear();
    this.p5.background(125);
    this.scene.draw(false); // 3. 渲染整个场景
  }
}

/*
  通过点击添加 bone
*/
export class Sketch03 extends Sketch {
  private ik: InverseKinematics = new InverseKinematics(true);
  private startLook: boolean = true;
  private fixed: Element | null = null;
  private mouseOut: boolean = true;
  public setup(): void {
    super.setup();
    this.p5
      .createCanvas(300, 300)
      .mouseOut(() => {
        this.startLook = false;
        this.mouseOut = true;
      })
      .mouseOver(() => (this.mouseOut = false));
    this.scene.add(this.ik);
    this.p5.background(125);
    this.p5.createDiv("InverseKinematics").position(0, 0);
    this.fixed = this.p5.createCheckbox("Is Fixed").position(0, this.p5.height);
    for (let i = 0; i < 5; i++) {
      this.ik.addLink(
        new IKConeBone(
          new Vector(this.p5.width / 2, this.p5.height),
          -this.p5.HALF_PI,
          50
        )
      );
    }
  }
  public draw(): void {
    // @ts-ignore
    this.ik.fixed = this.fixed!.checked();
    if (this.startLook) this.ik.lookAt(this.p5.mouseX, this.p5.mouseY);
    this.p5.clear();
    this.p5.background(125);
    this.scene.draw(false);
  }

  public mouseClicked(): void {
    if (this.mouseOut) return;
    const { mouseButton, LEFT } = this.p5;
    if (mouseButton === LEFT) {
      this.startLook = true;
    }
  }

  public keyPressed(): void {
    if (this.mouseOut) return;
    const { keyCode, ESCAPE } = this.p5;
    if (keyCode === ESCAPE) {
      this.startLook = false;
    }
  }
}
