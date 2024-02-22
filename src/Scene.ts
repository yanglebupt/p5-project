import p5 from "p5";
import { InstanceDrawAdapter } from "./adapters/DrawAdapter";
import { IShape } from "./interfaces";

export class Scene {
  public shapeList: IShape[] = [];

  constructor(public p5?: p5) {}

  public add<T extends IShape>(shape: T): T {
    this.shapeList.push(shape);
    return shape;
  }

  public remove<T extends IShape>(shape: T): T {
    const idx = this.shapeList.indexOf(shape);
    if (idx >= 0) {
      this.shapeList.splice(idx, 1);
    }
    return shape;
  }

  public traverse<T extends IShape>(func: (shape: T, index: number) => void) {
    (this.shapeList as T[]).forEach(func);
  }

  public clear<T extends IShape>(func?: (shape: T, index: number) => void) {
    func && (this.shapeList as T[]).forEach(func);
    this.shapeList = [];
  }

  public draw(useAdapter: boolean = true) {
    this.traverse((shape) => {
      if (shape.hidden) return;
      if (useAdapter) {
        if (InstanceDrawAdapter.drawAdapter == null)
          throw new Error(
            "Can't find global drawAdapter, please register or use shape draw function"
          );
        if (
          !InstanceDrawAdapter.drawAdapter.draw(shape) &&
          this.p5 != null &&
          !shape.draw(this.p5)
        ) {
          throw new Error("Can't draw");
        }
      } else if (this.p5 != null) {
        if (
          !shape.draw(this.p5) &&
          InstanceDrawAdapter.drawAdapter != null &&
          !InstanceDrawAdapter.drawAdapter.draw(shape)
        ) {
          throw new Error("Can't draw");
        }
      } else {
        throw new Error("Can't draw");
      }
    });
  }
}
