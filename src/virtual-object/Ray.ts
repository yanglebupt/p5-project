import { Vector } from "p5";
import { Shape } from "../interfaces";
import { LineAttribute } from "./Line";

export class Ray<T extends {}> extends Shape<T> {
  [Symbol.toStringTag] = "Ray";

  public start: Vector;
  public dir: Vector;
  public angle: number;
  public len: number;
  public end: Vector;

  constructor(
    start: Vector,
    dirOrAngle: Vector | number,
    len: number,
    attribute?: Partial<T>,
    defaultAttribute?: Partial<T>
  ) {
    super(defaultAttribute as T, attribute);
    this.start = start;
    if (dirOrAngle instanceof Vector) {
      this.dir = Vector.normalize(dirOrAngle);
      this.angle = this.calcAngle();
    } else {
      this.angle = dirOrAngle;
      this.dir = this.calcDir();
    }
    this.len = len;
    this.end = this.calcEnd();
  }

  calcEnd() {
    return (this.end = Vector.add(this.start, this.dir.copy().mult(this.len)));
  }

  calcDir() {
    return (this.dir = Vector.fromAngle(this.angle));
  }

  calcAngle() {
    return (this.angle = this.dir.heading());
  }

  public get position() {
    return this.start;
  }

  public get p1() {
    return this.start;
  }

  public get p2() {
    return this.end;
  }
}

export class LineRay extends Ray<LineAttribute> {
  [Symbol.toStringTag] = "Line";
  static defaultAttribute: LineAttribute = {
    color: "white",
    size: 1,
    cap: "round",
  };
  constructor(
    start: Vector,
    dirOrAngle: Vector | number,
    len: number,
    attribute?: Partial<LineAttribute>,
    defaultAttribute?: Partial<LineAttribute>
  ) {
    super(
      start,
      dirOrAngle,
      len,
      attribute,
      defaultAttribute ?? LineRay.defaultAttribute
    );
  }
}
