import { Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.panzoom.js";
import "@svgdotjs/svg.draggable.js";
import React, { useCallback, useMemo } from "react";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";
import svg from "./assets/svg.svg";

const ReactSVGMemo = React.memo(ReactSVG);

function App() {
  const initSvg = useCallback(() => {
    const svg = SVG("#svg").size("100%", "100%") as Svg;

    SVG("#group")?.remove();
    const group = svg
      .group()
      .attr("id", "group")
      .css("cursor", "pointer")
      .draggable();

    const rect = group
      .rect(200, 200)
      .move(200, 200)
      .rotate(0)
      .fill("#f06")
      .transform({ origin: "center center" });

    const circle = group
      .circle(30)
      .move(rect.x(), rect.y())
      .translate(-15, -15)
      .fill("#fff")
      .css("cursor", "grab")
      .attr("id", "circle");

    let rotating = false;

    circle.on("mousedown", () => {
      rotating = true;
      group.draggable(false);
    });

    svg.on("mouseup", () => {
      if (rotating) {
        rotating = false;
        group.draggable();
      }
    });

    svg.on("mousemove", (e) => {
      if (rotating) {
        const event = e as MouseEvent;

        const pt = svg.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const mouse = pt.matrixTransform(svg.node.getScreenCTM()?.inverse());

        const A = Math.atan2(
          rect.node.getBoundingClientRect().height / 2,
          rect.node.getBoundingClientRect().width / 2,
        );

        const a =
          Math.atan2(
            rect.attr("y") + rect.attr("height") / 2 - mouse.y,
            rect.attr("x") + rect.attr("width") / 2 - mouse.x,
          ) - A;

        group.transform({
          rotate: a * (180 / Math.PI),
        });
      }
    });
  }, []);

  const memoValue: Omit<ReactSVGProps, "ref"> = useMemo(
    () => ({
      src: svg,
      className: "svg-wrapper",
      wrapper: "div",
      loading: () => <div>Chargement...</div>,
      beforeInjection: (svg) => {
        svg.setAttribute("id", "svg");
      },
      afterInjection: () => {
        console.log("SVG loaded successfully");
        initSvg();
      },
      onError: (error) => {
        console.log("Error loading SVG");
        console.error(error);
      },
    }),
    [initSvg],
  );

  return <ReactSVGMemo {...memoValue} />;
}

export default App;
