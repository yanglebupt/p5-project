import p5, { Vector } from "p5";
import Link from "./Link";
import {
  ConeRay,
  ConeRayAttribute,
  P5Adapter,
  applyMixins,
} from "@ylbupt/p5-project";

export class FollowRay {
  constructor(public start: Vector, public angle: number, public len: number) {}
  public lookAt(target: Vector) {
    // 1. 朝向目标
    this.angle = Vector.heading(Vector.sub(target, this.start));
    // 2. end 平移到 target
    this.start = Vector.sub(
      target,
      Vector.fromAngle(this.angle).copy().mult(this.len)
    );
  }
}

/**
 * 骨骼部分
 */
export interface IKConeBone extends FollowRay, ConeRay {}
export class IKConeBone extends ConeRay {
  [Symbol.toStringTag] = "IKConeBone";
  public static defaultAttribute: ConeRayAttribute = ConeRay.defaultAttribute; // 默认节点使用一样的样式
  constructor(
    start: Vector,
    dirOrAngle: Vector | number,
    len: number,
    radius: number = 10,
    attribute?: Partial<ConeRayAttribute>
  ) {
    super(
      start,
      dirOrAngle,
      len,
      radius,
      attribute,
      IKConeBone.defaultAttribute
    );
  }
  draw(p5: p5): boolean {
    P5Adapter.drawConeRay(this, p5);
    return true;
  }
}
applyMixins(IKConeBone, [FollowRay, ConeRay]);

/**
 * 逆向动力学
 */
export class InverseKinematics extends Link<ConeRayAttribute, IKConeBone> {
  [Symbol.toStringTag] = "ForwardKinematics";
  public static defaultAttribute: ConeRayAttribute = ConeRay.defaultAttribute; // 默认节点使用一样的样式
  public fixedPoint: Vector = new Vector(0, 0);
  constructor(public fixed: boolean, attribute?: ConeRayAttribute) {
    super(InverseKinematics.defaultAttribute, attribute);
  }
  public addLink(segment: IKConeBone) {
    const curLength = this.segments.length;
    if (curLength == 0) {
      this.fixedPoint = segment.start;
    } else {
      const parent = this.segments[curLength - 1];
      segment.start = parent.end;
      segment.calcEnd();
    }
    this.segments.push(segment);
  }
  public lookAt(target: Vector): void;
  public lookAt(x: number, y: number): void;
  public lookAt(x: number | Vector, y?: number) {
    let target = x instanceof Vector ? x : new Vector(x, y);
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].lookAt(target);
      this.segments[i].calcDir();
      this.segments[i].calcEnd();
      target = this.segments[i].start; // 下一个看向上一个的起点
    }
    // 3. 把整体拉回到 fixed point 位置
    if (this.fixed) {
      let startPoint = this.fixedPoint;
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].start = startPoint;
        this.segments[i].calcEnd();
        startPoint = this.segments[i].end;
      }
    }
  }
}
