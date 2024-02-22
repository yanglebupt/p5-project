import p5, { Vector } from "p5";
import { Rect } from "../virtual-object/Rect";

export interface IShape {
  hidden: boolean;
  get position(): Vector;
  set position(value: Vector);
  draw(_p5: p5): boolean;
}

export abstract class Shape<T extends {}> implements IShape {
  [Symbol.toStringTag] = "Shape";
  public attribute: T;
  constructor(defaultAttribute: T, attribute?: Partial<T>) {
    this.attribute = Object.assign(
      JSON.parse(JSON.stringify(defaultAttribute)),
      attribute
    ) as T;
  }
  public abstract get position(): Vector;
  public hidden: boolean = false;
  draw(_p5: p5): boolean {
    return false;
  }
}

export interface AreaRange {
  intersect(boundingBox: Rect): boolean;
  contains(position: Vector): boolean;
}
