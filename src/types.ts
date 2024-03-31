import { G, Svg, SVG } from "@svgdotjs/svg.js";

export class SvgObject {
  id: string;
  group: G;
  pos: { x: number; y: number };
  width: number;
  height: number;
  a: number;
  img: string;

  constructor(
    id: string,
    img: string,
    pos = { x: 0, y: 0 },
    width = 200,
    height = 200,
    a = 0,
  ) {
    this.id = id;
    this.img = img;
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.a = a;

    this.group = (SVG("#svg") as Svg).group().attr("id", "bob-group");
  }

  public draw() {
    this.group
      .image(this.img)
      .size(this.width, this.height)
      .css("cursor", "grab")
      .attr("id", this.id);

    this.group
      .rect(this.width, this.height)
      .stroke({
        color: "dodgerblue",
        width: 3,
        dasharray: "10,10",
        linejoin: "round",
        linecap: "round",
      })
      .fill("none");

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

  public toJSON() {
    return {
      id: this.id,
      img: this.img,
      pos: this.pos,
      width: this.width,
      height: this.height,
      a: this.a,
    };
  }
}
