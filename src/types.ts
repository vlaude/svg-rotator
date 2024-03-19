import { G, Svg, SVG } from "@svgdotjs/svg.js";

export class SvgObject {
  id: string;
  group: G;
  pos: { x: number; y: number };
  width: number;
  height: number;
  a: number;
  color: string;

  constructor(
    id: string,
    color = "#f06",
    pos = { x: 0, y: 0 },
    width = 200,
    height = 200,
    a = 0,
  ) {
    this.id = id;
    this.color = color;
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.a = a;

    this.group = (SVG("#svg") as Svg).group().attr("id", "bob-group");
  }

  public draw() {
    this.group
      .rect(this.width, this.height)
      .rotate(this.a)
      .fill(this.color)
      .css("cursor", "grab")
      .attr("id", this.id);

    this.group
      .circle(30)
      .translate(-15, -15)
      .fill("dodgerblue")
      .css("cursor", "grab")
      .attr("id", `${this.id}-circle`)
      .front();

    this.update();
  }

  public setPos(x: number, y: number) {
    this.pos = { x, y };
  }

  public setAngle(a: number) {
    this.a = a;
  }

  public update() {
    this.group.transform({
      translate: [this.pos.x, this.pos.y],
      rotate: (this.a * 180) / Math.PI,
    });
  }
}
