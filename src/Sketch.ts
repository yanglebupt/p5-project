import p5, { p5InstanceExtensions } from "p5";
import { Scene } from "./Scene";
import { InstanceDrawAdapter } from "./adapters/DrawAdapter";
import P5Adapter from "./adapters/P5Adapter";

export type LifeFunc = (p5: p5) => void;

//@ts-ignore
export interface Sketch extends p5InstanceExtensions {}
//@ts-ignore
export abstract class Sketch implements p5InstanceExtensions {
  private readonly LifeFuncList: string[] = [
    "preload",
    "setup",
    "draw",
    "keyPressed",
    "keyReleased",
    "keyTyped",
    "mouseMoved",
    "mouseDragged",
    "mousePressed",
    "mouseReleased",
    "mouseClicked",
    "doubleClicked",
    "mouseWheel",
    "touchStarted",
    "touchMoved",
    "touchEnded",
  ];
  protected scene: Scene;
  constructor(protected p5: p5) {
    // 对生命周期方法重新绑定 this，方便实例内部直接声明周期方法
    this.LifeFuncList.forEach((lifeFunc) => {
      Reflect.set(
        p5,
        lifeFunc,
        (Reflect.get(this, lifeFunc as any) as LifeFunc).bind(this)
      );
    });
    // 管理场景
    this.scene = new Scene(p5);
    InstanceDrawAdapter.UseAdapter(new P5Adapter(p5));
    /* 为 Sketch 实例设置代理 */
    Object.keys(Object.getPrototypeOf(p5)).forEach((k) => {
      console.log(Object.getOwnPropertyDescriptor(p5, k));
      if (p5[k] && p5[k].bind) {
        Object.defineProperty(this, k, {
          get: () => {
            return p5[k].bind(p5);
          },
          configurable: false,
        });
      } else {
        Object.defineProperty(this, k, {
          get: () => p5[k],
          configurable: false,
        });
      }
    });
  }
  public preload() {}
  public keyPressed() {}
  public keyReleased() {}
  public keyTyped() {}
  public mouseMoved() {}
  public mouseDragged() {}
  public mousePressed() {}
  public mouseReleased() {}
  public mouseClicked() {}
  public doubleClicked() {}
  public mouseWheel(_evt: { delta: number }) {}
  public touchStarted() {}
  public touchMoved() {}
  public touchEnded() {}
  public setup() {
    this.p5.smooth();
    this.p5.rectMode(this.p5.CENTER);
    this.p5.angleMode(this.p5.DEGREES);
    this.p5.ellipseMode(this.p5.RADIUS);
    this.p5.colorMode(this.p5.RGB);
  }
  public abstract draw(): void;
}
