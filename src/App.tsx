import { Svg, SVG } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const svg = SVG('#svg').addTo('body') as Svg;
    svg.panZoom({
      panButton: 1,
    });

    SVG('#group')?.remove();

    const group = svg.group().attr('id', 'group');

    const rect = group
      .rect(200, 200)
      .move(200, 200)
      .rotate(0)
      .fill('#f06')
      .transform({ origin: 'center center' });

    const circle = group
      .circle(30)
      .move(rect.x(), rect.y())
      .translate(-15, -15)
      .fill('#fff')
      .css('cursor', 'grab')
      .attr('id', 'circle');

    let rotating = false;

    svg.on('mousedown', (e) => {
      const event = e as MouseEvent;
      if (event.target === circle.node) {
        rotating = true;
      }
    });

    svg.on('mouseup', () => {
      rotating = false;
    });

    svg.on('mousemove', (e) => {
      if (rotating) {
        const event = e as MouseEvent;

        const pt = svg.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const mouse = pt.matrixTransform(svg.node.getScreenCTM()?.inverse());

        const A = Math.atan2(
          rect.node.getBoundingClientRect().height / 2,
          rect.node.getBoundingClientRect().width / 2
        );

        const a =
          Math.atan2(
            rect.attr('y') + rect.attr('height') / 2 - mouse.y,
            rect.attr('x') + rect.attr('width') / 2 - mouse.x
          ) - A;

        group.transform({
          rotate: a * (180 / Math.PI),
        });
      }
    });
  }, []);

  return <svg id="svg" width="100%" height="100%" viewBox="0 0 1000 600"></svg>; // does not work :-(
}

export default App;
