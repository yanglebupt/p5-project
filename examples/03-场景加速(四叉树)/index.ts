import p5, { Element, Vector } from "p5";
import {
  Sketch,
  Circle,
  Scene,
  AreaRange,
  IShape,
  Rect,
} from "@ylbupt/p5-project";
import { Quadtree } from "./Quadtree";

enum PointMode {
  Mouse = "mouse",
  Move = "move",
}

export class Sketch04 extends Sketch {
  private quadtree: Quadtree<Circle>;
  private range: AreaRange & IShape;
  private funds: Circle[] = [];
  private mouseOut: boolean = true;
  private startAddPoint: boolean = false;
  private startQueryPoint: boolean = false;
  private startMove: boolean = false;
  private radio: any = null;
  private scene2: Scene;
  private speed: number = 0.01;
  private dirs: Vector[] = [];
  private frameTitle: Element | null = null;
  private pointCount: Element | null = null;
  private pointCountText: Element | null = null;
  constructor(p5: p5) {
    super(p5);
    /////////////////////////////////
    this.scene2 = new Scene(this.p5);

    this.quadtree = new Quadtree(new Vector(0, 0), 0, 0);

    this.range = new Rect(new Vector(0, 0), 100, 100, {
      strokeColor: "red",
      fill: false,
      stroke: true,
      strokeWeight: 1,
    });
    // this.range = new Circle(new Vector(0, 0), 50, {
    //   strokeColor: "red",
    //   fill: false,
    //   stroke: true,
    //   strokeWeight: 1,
    // });
    this.range.hidden = true;
  }

  public setup(): void {
    super.setup();
    this.p5
      .createCanvas(300, 300)
      .mouseOut(() => (this.mouseOut = true))
      .mouseOver(() => (this.mouseOut = false));
    this.p5.background(125);
    this.radio = this.p5.createRadio() as any;
    this.radio.option(PointMode.Mouse, "mouse");
    this.radio.option(PointMode.Move, "move");
    this.radio.selected(PointMode.Mouse);
    this.p5.createDiv("Quadtree(Press A to Query, click start)").position(0, 0);
    this.frameTitle = this.p5.createDiv("FrameRate: ");
    this.frameTitle.position(0, this.p5.height - 30);
    this.pointCount = this.p5.createSlider(100, 2000, 300, 100);
    this.pointCountText = this.p5.createSpan("300");
    this.p5.createButton("new start").mousePressed(() => {
      this.startMove = false;
      this.startAddPoint = false;
      this.clearQuery();
      this.p5.clear();
      this.p5.background(125);
      this.quadtree.clear();
      if (this.radio.value() === PointMode.Move) {
        this.startMove = true;
      }
    });

    this.quadtree.position = new Vector(this.p5.width / 2, this.p5.height / 2);
    this.quadtree.width = this.p5.width;
    this.quadtree.height = this.p5.height;

    this.scene.add(this.range);
    this.scene.add(this.quadtree);
  }

  public draw(): void {
    this.p5.clear();
    this.p5.background(125);
    this.frameTitle?.html("FrameRate: " + this.p5.frameRate());
    this.pointCountText?.html(this.pointCount!.value() + "");
    if (this.startMove) {
      const existCount = this.scene2.shapeList.length;
      const count = this.pointCount!.value() as number;
      if (existCount < count) {
        /////////////////////////////////////////////
        for (let i = 0; i < count - existCount; i++) {
          const point = new Circle(
            new Vector(this.p5.random(5, 295), this.p5.random(5, 295)),
            3,
            { color: "black" }
          );
          this.scene2.add(point);
          this.dirs.push(Vector.random2D().normalize());
        }
      } else if (existCount > count) {
        this.scene2.shapeList.splice(count, existCount - count);
      }
      // 实时创建
      const quadtree2 = this.createDynamicQuadTree(this.scene2);
      quadtree2.draw(this.p5);
      // 开始碰撞检测
      this.scene2.traverse<Circle>((point) => {
        point.attribute.color = "black";
        const possibleCollision = quadtree2.query(
          // new Rect(point.center, 6 * point.radius, 6 * point.radius)
          new Circle(point.center, 2 * point.radius)
        );
        possibleCollision.forEach((p) => {
          if (p !== point && this.intersect(p, point)) {
            point.attribute.color = p.attribute.color = "green";
          }
        });
      });
    } else {
      this.scene.draw();
    }
  }

  public intersect(point: Circle, other: Circle) {
    return (
      Vector.sub(point.center, other.center).mag() <=
      other.radius + point.radius
    );
  }

  public createDynamicQuadTree(scene: Scene): Quadtree<Circle> {
    const quadtree = new Quadtree<Circle>(
      new Vector(this.p5.width / 2, this.p5.height / 2),
      this.p5.width,
      this.p5.height
    );
    scene.traverse<Circle>((point, i) => {
      this.movePoint(point, this.dirs[i]);
      quadtree.add(point);
    });
    return quadtree;
  }

  public movePoint(point: Circle, dir: Vector) {
    point.center = Vector.add(
      point.center,
      dir.copy().mult(this.p5.deltaTime * this.speed)
    );
    if (
      point.center.x <= 0 ||
      point.center.x >= this.p5.width ||
      point.center.y <= 0 ||
      point.center.y >= this.p5.height
    ) {
      dir.mult(-1, -1);
    }
  }

  public mouseClicked(): void {
    if (this.mouseOut) return;
    this.startAddPoint = true;
    this.clearQuery();
  }

  public clearQuery() {
    this.startQueryPoint = false;
    this.range.hidden = true;
    this.funds.forEach((f) => (f.attribute.color = "black"));
  }

  public mouseMoved(): void {
    if (this.mouseOut) return;
    if (this.startAddPoint && this.radio.value() === PointMode.Mouse)
      this.quadtree.add(
        new Circle(new Vector(this.p5.mouseX, this.p5.mouseY), 3, {
          color: "black",
        })
      );
    if (this.startQueryPoint && this.radio.value() === PointMode.Mouse) {
      this.range.position = new Vector(this.p5.mouseX, this.p5.mouseY);
      this.range.hidden = false;
      this.funds.forEach((f) => (f.attribute.color = "black"));
      this.funds = this.quadtree.query(this.range);
      this.funds.forEach((f) => (f.attribute.color = "green"));
    }
  }

  public keyPressed(): void {
    const { keyCode, ESCAPE, key } = this.p5;
    if (keyCode === ESCAPE) {
      this.startAddPoint = false;
      this.startQueryPoint = false;
    } else if (key === "a") {
      this.startAddPoint = false;
      this.startQueryPoint = true;
    }
  }
}
