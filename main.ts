import p5 from "p5";
import { createP5instance } from "./src/tools";
import { Sketch02, Sketch03 } from "./examples/02-FK和IK测试";
import Sketch01 from "./examples/01-画笔测试";
import { Sketch04 } from "./examples/03-场景加速(四叉树)";
import { MainSketch } from "./start-demo";

// createP5instance((instance: p5) => new MainSketch(instance), "app");

createP5instance((instance: p5) => new Sketch01(instance), "app01");
createP5instance((instance: p5) => new Sketch02(instance), "app02");
createP5instance((instance: p5) => new Sketch03(instance), "app03");
createP5instance((instance: p5) => new Sketch04(instance), "app");
