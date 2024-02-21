import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.panzoom.js";

setTimeout(() => {
  var SVGLink_NS = "http://www.w3.org/1999/xlink";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var svg = document.getElementById("svg");
  var deg = 180 / Math.PI;
  var rotating = false;
  var dragging = false;
  var impact = {
    x: 0,
    y: 0,
  };
  var m = {
    //mouse
    x: 0,
    y: 0,
  };
  var delta = {
    x: 0,
    y: 0,
  };
  var ry = []; // elements array
  var objectsRy = [];

  var hexaPolygon = {
    properties: {
      fill: "url(#trama)",
      points:
        "70,0 35.00000000000001,60.6217782649107 -34.999999999999986,60.62177826491071 -70,8.572527594031473e-15 -35.00000000000003,-60.621778264910695 35.00000000000001,-60.6217782649107 70,-1.7145055188062946e-14",
    },
    //parent: this.g,
    tagName: "polygon",
    pos: {
      x: 130,
      y: 250,
    },
  };
  objectsRy.push(hexaPolygon);

  var pentaPolygon = {
    properties: {
      fill: "url(#trama)",
      points:
        "0,-70 66.57395614066074,-21.631189606246316 41.14496766047312,56.63118960624632 -41.144967660473114,56.63118960624632 -66.57395614066075,-21.63118960624631 -1.2858791391047208e-14,-70",
    },
    //parent: this.g,
    tagName: "polygon",
    pos: {
      x: 400,
      y: 400,
    },
  };

  objectsRy.push(pentaPolygon);

  var ellipsePath = {
    properties: {
      d: "M-90,0 a90,50 0 1, 0 0,-1  z",
      fill: "url(#trama)",
    },
    //parent: this.g,
    tagName: "path",
    pos: {
      x: 370,
      y: 150,
    },
  };
  objectsRy.push(ellipsePath);

  SVG("#svg").size(800, 800);
  // SVG("#svg").rect(20, 20).fill("white");

  function Element(o, index) {
    this.g = document.createElementNS(SVG_NS, "g");
    this.g.setAttributeNS(null, "id", index);
    svg.appendChild(this.g);

    o.parent = this.g;

    this.el = drawElement(o);
    this.a = 0;
    this.tagName = o.tagName;
    this.elRect = this.el.getBoundingClientRect();
    this.svgRect = svg.getBoundingClientRect();
    this.Left = this.elRect.left - this.svgRect.left;
    this.Right = this.elRect.right - this.svgRect.left;
    this.Top = this.elRect.top - this.svgRect.top;
    this.Bottom = this.elRect.bottom - this.svgRect.top;

    this.LT = {
      x: this.Left,
      y: this.Top,
    };
    this.RT = {
      x: this.Right,
      y: this.Top,
    };
    this.LB = {
      x: this.Left,
      y: this.Bottom,
    };
    this.RB = {
      x: this.Right,
      y: this.Bottom,
    };
    this.c = {
      x: 0, //(this.elRect.width / 2) + this.Left,
      y: 0, //(this.elRect.height / 2) + this.Top
    };
    this.o = {
      x: o.pos.x,
      y: o.pos.y,
    };

    this.A = Math.atan2(this.elRect.height / 2, this.elRect.width / 2);
    console.log(this.A);
    this.pointsValue = function () {
      // points for the box
      return (
        this.Left +
        "," +
        this.Top +
        " " +
        this.Right +
        "," +
        this.Top +
        " " +
        this.Right +
        "," +
        this.Bottom +
        " " +
        this.Left +
        "," +
        this.Bottom +
        " " +
        this.Left +
        "," +
        this.Top
      );
    };

    var box = {
      properties: {
        points: this.pointsValue(),
        fill: "none",
        stroke: "dodgerblue",
        "stroke-dasharray": "5,5",
      },
      parent: this.g,
      tagName: "polyline",
    };
    this.box = drawElement(box);

    var leftTop = {
      properties: {
        cx: this.LT.x,
        cy: this.LT.y,
        r: 6,
        fill: "blue",
      },
      parent: this.g,
      tagName: "circle",
    };

    this.lt = drawElement(leftTop);

    this.update = function () {
      var transf =
        "translate(" +
        this.o.x +
        ", " +
        this.o.y +
        ")" +
        " rotate(" +
        this.a * deg +
        ")";
      //this.el.setAttributeNS(null, 'transform', transf);
      //this.box.setAttributeNS(null, 'transform', transf);
      //this.lt.setAttributeNS(null, 'transform', transf);
      this.g.setAttributeNS(null, "transform", transf);
    };
  }

  for (var i = 0; i < objectsRy.length; i++) {
    var el = new Element(objectsRy[i], i + 1);
    el.update();
    ry.push(el);
  }

  // EVENTS

  svg.addEventListener(
    "mousedown",
    function (evt) {
      console.log(evt.x);
      console.log(evt.y);

      var index = parseInt(evt.target.parentElement.id) - 1;
      if (evt.target.tagName == ry[index].tagName) {
        dragging = index + 1;
        impact = oMousePos(svg, evt);
        delta.x = ry[index].o.x - impact.x;
        delta.y = ry[index].o.y - impact.y;
      }

      if (evt.target.tagName == "circle") {
        rotating = parseInt(evt.target.parentElement.id);
      }
    },
    false,
  );

  svg.addEventListener(
    "mouseup",
    function (evt) {
      rotating = false;
      dragging = false;
    },
    false,
  );

  svg.addEventListener(
    "mouseleave",
    function (evt) {
      rotating = false;
      dragging = false;
    },
    false,
  );

  svg.addEventListener(
    "mousemove",
    function (evt) {
      m = oMousePos(svg, evt);

      if (dragging) {
        var index = dragging - 1;
        ry[index].o.x = m.x + delta.x;
        ry[index].o.y = m.y + delta.y;
        ry[index].update();
      }

      if (rotating) {
        var index = rotating - 1;
        console.log(ry[index].A);
        ry[index].a =
          Math.atan2(ry[index].o.y - m.y, ry[index].o.x - m.x) - ry[index].A;
        ry[index].update();
      }
    },
    false,
  );

  // HELPERS

  function oMousePos(svg, evt) {
    var ClientRect = svg.getBoundingClientRect();
    return {
      //objeto
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top),
    };
  }

  function drawElement(o) {
    /*
          var o = {
            properties : {
            x1:100, y1:220, x2:220, y2:70},
            parent:document.querySelector("svg"),
            tagName:'line'
          }
          */
    var el = document.createElementNS(SVG_NS, o.tagName);
    for (var name in o.properties) {
      if (o.properties.hasOwnProperty(name)) {
        el.setAttributeNS(null, name, o.properties[name]);
      }
    }
    o.parent.appendChild(el);
    return el;
  }
}, 1000);
