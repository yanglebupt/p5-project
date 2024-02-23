import p5, { Vector } from "p5";
import Link from "./Link";
import {
  ConeRay,
  ConeRayAttribute,
  P5Adapter,
  applyMixins,
} from "@ylbupt/p5-project";

export class LocalRay {
  constructor(public angle: number, public localAngle: number) {}

  calcLocal(parent: LocalRay | null) {
    this.localAngle = this.angle - (parent == null ? 0 : parent.angle);
  }
  calcWorld(parent: LocalRay | null) {
    this.angle = this.localAngle + (parent == null ? 0 : parent.angle);
  }
}

/**
 * 骨骼部分
 */
export interface FKConeBone extends LocalRay, ConeRay {}
export class FKConeBone extends ConeRay {
  [Symbol.toStringTag] = "FKConeBone";
  public static defaultAttribute: ConeRayAttribute = ConeRay.defaultAttribute; // 默认节点使用一样的样式
  // 选择一个父类进行初始化
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
      FKConeBone.defaultAttribute
    );
  }

  draw(p5: p5): boolean {
    P5Adapter.drawConeRay(this, p5);
    return true;
  }
}
applyMixins(FKConeBone, [LocalRay, ConeRay]);

/**
 * 前向动力学
 */
export class ForwardKinematics extends Link<ConeRayAttribute, FKConeBone> {
  [Symbol.toStringTag] = "ForwardKinematics";
  public static defaultAttribute: ConeRayAttribute = ConeRay.defaultAttribute; // 默认节点使用一样的样式
  constructor(attribute?: ConeRayAttribute) {
    super(ForwardKinematics.defaultAttribute, attribute);
  }
  public addLink(segment: FKConeBone) {
    const curLength = this.segments.length;
    if (curLength > 0) {
      const parent = this.segments[curLength - 1];
      segment.start = parent.end;
      segment.calcLocal(parent);
      segment.calcEnd();
    }
    this.segments.push(segment);
  }

  // 对某根旋转
  public rotate(incr: number, idx: number) {
    let current: FKConeBone = this.segments[idx],
      parent: FKConeBone | null = idx > 0 ? this.segments[idx - 1] : null;
    current.localAngle += incr;
    current.calcWorld(parent);
    current.calcDir();
    current.calcEnd();
    // 更新子节点
    for (let i = idx + 1; i < this.segments.length; i++) {
      (current = this.segments[i]), (parent = this.segments[i - 1]);
      current.start = parent.end;
      current.calcWorld(parent);
      current.calcDir();
      current.calcEnd();
    }
  }
}
