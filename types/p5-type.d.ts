import "p5";

export declare module "p5" {
  // 使用interface扩展class的实例属性
  interface Vector {
    abs(): void;
    max(max: number): void;
    max(max: Vector): void;
    min(min: number): void;
    min(min: Vector): void;
  }
  interface VectorConstructor extends Vector {
    new (x?: number, y?: number, z?: number): Vector;
    (x?: number, y?: number, z?: number): Vector;
    readonly prototype: Vector;
    abs(v: Vector): Vector;
    max(v: Vector, max: number): Vector;
    max(v: Vector, max: Vector): Vector;
    min(v: Vector, min: number): Vector;
    min(v: Vector, min: Vector): Vector;
  }
  declare var Vector: VectorConstructor;
}
