import { Sketch, Circle, P5Adapter } from "@ylbupt/p5-project";
import p5, { Color, Element, Vector } from "p5";
import styles from "./style.module.css";

enum CanvasMode {
  Brush = "Brush mode",
  Normal = "Normal mode",
}

interface Brush {
  size: number;
  color: Color;
  intensity: number;
}

class BrushDom {
  private colorPicker: Element;
  private intensitySlider: Element;
  private clearBtn: Element;
  private saveBtn: Element;
  private parent: Element;
  public brushCursor: Element; // TODO 使用另一个 canvas 替代，一个画布一个图层
  public state: { save: boolean; clear: boolean };

  constructor(public p5: p5, public brush: Brush) {
    this.state = { save: false, clear: false };
    this.parent = this.p5.createDiv();
    this.brushCursor = this.p5.createDiv();
    this.brushCursor.addClass(styles.brushcursor);
    this.colorPicker = this.p5.createColorPicker(this.brush.color);
    this.clearBtn = this.p5.createButton("Clear");
    this.saveBtn = this.p5.createButton("Save");
    this.intensitySlider = this.p5.createSlider(
      1,
      100,
      this.brush.intensity,
      1
    );
    this.parent.addClass(styles.brushdom);
    this.colorPicker.parent(this.parent);
    this.intensitySlider.parent(this.parent);
    this.clearBtn.parent(this.parent);
    this.saveBtn.parent(this.parent);
    this.saveBtn.mouseClicked(() => {
      this.state.save = true;
    });
    this.clearBtn.mouseClicked(() => {
      this.state.clear = true;
    });
  }

  draw() {
    // update state
    this.brush.intensity = this.intensitySlider.value() as number;
    this.brush.color = this.p5.color(this.colorPicker.value() as string);
    this.brush.color.setAlpha(
      255 *
        ((this.p5.alpha(this.brush.color) / 255) *
          this.p5.map(this.brush.intensity, 0, 100, 0, 1))
    );
    if (this.brushCursor.style("display") == "none") return;
    this.brushCursor.size(2 * this.brush.size, 2 * this.brush.size);
    this.brushCursor.position(this.p5.mouseX, this.p5.mouseY);
    this.brushCursor.style("background-color", this.brush.color);
  }
}

export default class Sketch01 extends Sketch {
  private mode: CanvasMode = CanvasMode.Normal;
  private title: Element;
  private brush: Brush;
  private brushDom: BrushDom;
  private paint: boolean = false;
  private isnew: boolean = true;
  private mouseOut: boolean = false;

  constructor(p5: p5) {
    super(p5);
    this.title = p5.createP(this.mode);
    this.title.addClass(styles.center);
    this.brush = {
      size: 5,
      color: p5.color(255, 0, 255, 255),
      intensity: 50,
    };
    this.brushDom = new BrushDom(this.p5, this.brush);
  }

  public setup(): void {
    super.setup();
    this.p5.frameRate(120);
    this.p5.background(125);
    this.p5.createDiv("Press B to brush").position(0, 0);

    this.p5
      .createCanvas(300, 300)
      .mouseOut(() => {
        this.mouseOut = true;
        this.paint = false;
      })
      .mouseOver(() => {
        this.mouseOut = false;
      });
  }

  public draw(): void {
    this.brushDom.draw();
    if (this.brushDom.state.clear) {
      this.p5.clear();
      this.p5.background(125);
      this.p5.cursor(this.p5.ARROW);
      this.scene.clear();
      this.brushDom.state.clear = false;
      return;
    } else if (this.brushDom.state.save) {
      this.brushDom.state.save = false;
      this.p5.saveCanvas("test", "jpg");
    }
    if (this.mode === CanvasMode.Normal) {
      this.normalMode();
    } else {
      this.brushMode();
    }
  }

  public normalMode() {
    this.paint = false;
    this.p5.cursor(this.p5.ARROW);
    this.brushDom.brushCursor.hide();
    if (this.isnew) {
      // 初始背景，后面保留绘制
      this.p5.clear();
      this.p5.background(125);
      this.isnew = false;
    }
  }

  public brushMode() {
    this.p5.noCursor();
    if (this.paint) {
      this.brushDom.brushCursor.hide();
      ////////////////方式一////////////////////////
      // this.p5.noStroke();
      // this.p5.noFill();
      // this.p5.fill(this.brush.color);
      // this.p5.circle(this.p5.mouseX, this.p5.mouseY, this.brush.size); // 之间的间隙需要填充，不清楚，之前绘制的保留，这个性能好，但无法记录之前绘制的

      ////////////////方式二////////////////////////
      // this.p5.clear();
      // this.p5.background(125);
      // this.scene.add(
      //   new Circle(
      //     new Vector(this.p5.mouseX, this.p5.mouseY),
      //     this.brush.size,
      //     {
      //       color: this.brush.color,
      //     }
      //   )
      // );
      // this.scene.draw(true); // scene 需要先清除然后重新绘制，这里需要检测，是否需要重新绘制

      ////////////////方式三（和方式一是相同的）////////////////////////
      P5Adapter.drawCircle(
        new Circle(
          new Vector(this.p5.mouseX, this.p5.mouseY),
          this.brush.size,
          {
            color: this.brush.color,
          }
        ),
        this.p5
      );
    } else {
      if (this.mouseOut) {
        this.brushDom.brushCursor.hide();
      } else {
        // move the brush, 但是不绘制，可视化画笔，最好放在另一个 canvas 上
        this.brushDom.brushCursor.show();
      }
    }
  }

  public mousePressed(): void {
    if (this.mouseOut) return;
    const { mouseButton, LEFT } = this.p5;
    if (mouseButton === LEFT && this.mode === CanvasMode.Brush) {
      this.paint = true;
    }
  }

  public mouseReleased(): void {
    const { mouseButton, LEFT } = this.p5;
    if (mouseButton === LEFT && this.mode === CanvasMode.Brush) {
      this.paint = false;
    }
  }

  public mouseWheel({ delta }: { delta: number }) {
    if (this.mode === CanvasMode.Brush) {
      this.brush.size += delta * 0.01;
      return false;
    }
  }

  public keyPressed(): void {
    const { key, keyCode, ESCAPE } = this.p5;
    if (key === "b") {
      this.mode = CanvasMode.Brush;
      this.title.html(this.mode);
    } else if (keyCode === ESCAPE) {
      this.mode = CanvasMode.Normal;
      this.title.html(this.mode);
    }
  }
}
