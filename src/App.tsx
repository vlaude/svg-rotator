import { Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.panzoom.js";
import React, { useCallback, useMemo } from "react";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";
import svg from "./assets/svg.svg";
import { SvgObject } from "./types.ts";

const ReactSVGMemo = React.memo(ReactSVG);

function App() {
  const initSvg = useCallback(() => {
    const svg = SVG("#svg").size("100%", "100%") as Svg;
    svg.clear();

    svg.panZoom({
      zoomMin: 0.25,
      zoomMax: 2.5,
      panButton: 1,
      zoomFactor: 0.1,
    });

    svg.on("panStart", () => svg.css("cursor", "grabbing"));
    svg.on("panEnd", () => svg.css("cursor", "default"));

    let objects: SvgObject[] = [];

    const json = localStorage.getItem("appState");
    if (json) {
      objects = JSON.parse(json).objects.map(
        (o: any) => new SvgObject(o.id, o.color, o.pos, o.width, o.height, o.a),
      );
    } else {
      const bob = new SvgObject("bob");
      const tom = new SvgObject("tom", "yellow", { x: 300, y: 300 });
      const wiwi = new SvgObject("wiwi", "blue", { x: 400, y: 100 });
      objects = [bob, tom, wiwi];
    }

    objects.forEach((o) => {
      o.draw();
    });

    let dragging: SvgObject | null = null;
    // dragging delta is used to move the object from the mouse position on the said object when dragging
    let draggingDelta = { x: 0, y: 0 };
    let rotating: SvgObject | null = null;

    svg.on("mousedown", (e) => {
      const event = e as any;

      const draggingTarget = objects.find((o) => o.id === event.target.id);
      const rotatingTarget = objects.find(
        (o) => `${o.id}-circle` === event.target.id,
      );

      if (draggingTarget) {
        dragging = draggingTarget;
        const mouse = getMousePos(svg, event);
        draggingDelta = {
          x: dragging.pos.x - mouse.x,
          y: dragging.pos.y - mouse.y,
        };
      } else if (rotatingTarget) {
        rotating = rotatingTarget;
      }
    });

    svg.on("mouseup", () => {
      if (dragging) {
        dragging = null;
        draggingDelta = { x: 0, y: 0 };
        save(objects);
      } else if (rotating) {
        rotating = null;
        save(objects);
      }
    });

    svg.on("mousemove", (e) => {
      const event = e as MouseEvent;
      const mouse = getMousePos(svg, event);

      if (dragging) {
        dragging.setPos(mouse.x + draggingDelta.x, mouse.y + draggingDelta.y);
        dragging.update();
      } else if (rotating) {
        const pt = svg.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;

        const A = Math.atan2(
          rotating.group.node.getBoundingClientRect().height / 2,
          rotating.group.node.getBoundingClientRect().width / 2,
        );
        const a =
          Math.atan2(
            rotating.pos.y + 100 - mouse.y,
            rotating.pos.x + 100 - mouse.x,
          ) - A;

        rotating.setAngle(a);
        rotating.update();
      }
    });
  }, []);

  function getMousePos(svg: Svg, event: MouseEvent) {
    const pt = svg.node.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    return pt.matrixTransform(svg.node.getScreenCTM()?.inverse());
  }

  function save(objects: SvgObject[]) {
    localStorage.setItem(
      "appState",
      JSON.stringify({ objects: objects.map((o) => o.toJSON()) }),
    );
  }

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
