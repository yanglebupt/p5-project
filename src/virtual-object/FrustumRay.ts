import { Vector } from "p5";
import { Ray } from "./Ray";
import { StrokeAndFillAttribute } from "../adapters/attribute-interface";

export interface FrustumRayAttribute {
  triangle: StrokeAndFillAttribute;
  topCircle: StrokeAndFillAttribute;
  bottomCircle: StrokeAndFillAttribute;
}

export class FrustumRay extends Ray<FrustumRayAttribute> {
  [Symbol.toStringTag] = "FrustumRay";

  static defaultAttribute: FrustumRayAttribute = {
    triangle: {
      color: "red",
      stroke: false,
      fill: true,
      strokeWeight: 0,
      strokeColor: "red",
    },
    topCircle: {
      color: "yellow",
      stroke: false,
      fill: true,
      strokeWeight: 0,
      strokeColor: "red",
    },
    bottomCircle: {
      color: "yellow",
      stroke: false,
      fill: true,
      strokeWeight: 0,
      strokeColor: "red",
    },
  };

  public bottomRadius: number;
  public topRadius: number;
  constructor(
    start: Vector,
    dirOrAngle: Vector | number,
    len: number,
    bottomRadius: number,
    topRadius: number,
    attribute?: Partial<FrustumRayAttribute>
  ) {
    super(
      start,
      dirOrAngle as Vector,
      len,
      attribute,
      FrustumRay.defaultAttribute
    );
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
  }
}
