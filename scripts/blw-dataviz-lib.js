function w(e = 6) {
  const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let a = "";
  for (let t = 0; t < e; t++)
    a += s.charAt(Math.floor(Math.random() * s.length));
  return a;
}
function m(e, s, a) {
  e.setAttribute("width", s.toString()), e.setAttribute("height", Math.round(s / a).toString());
}
function g(e) {
  let s = e.clientWidth;
  const a = document.defaultView;
  if (!a)
    return NaN;
  const t = parseFloat(a.getComputedStyle(e).getPropertyValue("padding-left")), r = parseFloat(a.getComputedStyle(e).getPropertyValue("padding-right"));
  return isNaN(t) || (s = s - t), isNaN(r) || (s = s - r), s;
}
function V(e) {
  if (!e)
    return console.log("no config passed to newResponseSVG.  Returning null"), null;
  Array("maxXCoord", "maxYCoord").forEach((n) => {
    if (!e[n])
      return console.log(`config passed to newResponsiveSVG is missing ${n}. Returning null.`), null;
    if (!["string", "number"].includes(typeof e[n]))
      throw new Error(`The ${n} property of the config you pass to newResponsiveSVG must be a string or number`);
  });
  const s = typeof e.maxXCoord == "number" ? e.maxXCoord : parseFloat(e.maxXCoord), a = typeof e.maxYCoord == "number" ? e.maxYCoord : parseFloat(e.maxYCoord);
  if (s <= 0 || a <= 0)
    throw new Error("The maxXCoord and maxYCoord properties of the config passed to newResponseiveSVG must be strictly greater than 0.");
  const t = s / a, u = document.createElementNS("http://www.w3.org/2000/svg", "svg"), l = w();
  u.setAttribute("id", l), u.setAttribute("width", s.toString()), u.setAttribute("height", a.toString()), u.setAttribute("viewBox", `0 0 ${s.toString()} ${a.toString()}`), u.setAttribute("preserveAspectRatio", "xMinYMid");
  const o = document.getElementById(e.containerId);
  if (!o)
    return console.log(`newResponsiveSVG cannot locate element with id ${e.containerId}`), null;
  let i = g(o);
  return isNaN(i) ? (console.log(`newResponsiveSVG got NAN when it tried to get the width of ${o}`), null) : i <= 0 ? (console.log(`newResponsiveSVG got a 0 or negative value for the width of ${o}`), null) : (m(u, i, t), window.addEventListener("resize", () => {
    const n = document.getElementById(e.containerId);
    if (!n)
      throw new Error(`We detected a window resize, and thus tried to resize an svg created with newResponseiveSVG.  But you passed the containerId ${e.containerId} to newResponsiveSVG and we cannot find an element in the document with that id.`);
    let h = g(n);
    if (isNaN(h))
      throw new Error(`We detected a resize, and thus tried to resize an svg created with newResponseiveSVG. But got NAN when we tried to get the width of ${n}`);
    if (h <= 0)
      throw new Error(`We detected a resize, and thus tried to resize an svg created with newResponseiveSVG. But got 0 or a negative number when we tried to get the width of ${n}`);
    m(u, h, t);
  }), o.appendChild(u), l);
}
function y(e, s, a, t, r) {
  const u = /* @__PURE__ */ new Map();
  return s.forEach((l) => {
    const o = /* @__PURE__ */ new Map(), i = e.filter((n) => l.includes(n[t])).length;
    if (i === 0)
      throw new Error(`There are no rows in the data with values at key ${t} in array ${l}`);
    a.forEach((n) => {
      const h = e.filter((p) => n.includes(p[r]) && l.includes(p[t])).length;
      o.set(
        n,
        h / i
      );
    }), u.set(l, o);
  }), u;
}
function v(e, s, a, t) {
  const r = Array.from(e.keys()), l = (t - a.left - a.right - r.length * s) / (r.length - 1), o = /* @__PURE__ */ new Map();
  for (let i = 0; i < r.length; i++) {
    let n = a.left;
    if (i > 0 && r && r[i - 1] && o && o.get(r[i - 1])) {
      let h = o.get(r[i - 1]);
      n = h.left + h.width + l;
    }
    o.set(r[i], {
      left: n,
      width: s
    });
  }
  return o;
}
function c(e, s, a, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((u) => {
    const l = /* @__PURE__ */ new Map(), o = Array.from(e.get(u)?.keys()), i = t - a.top - a.bottom - s * (o.length - 1);
    for (let n = 0; n < o.length; n++) {
      let h = a.top;
      if (n > 0 && o && o[n - 1] && l && l.get(o[n - 1])) {
        const d = l.get(o[n - 1]);
        h = d.top + d.height + s;
      }
      let p = 0;
      e && e.get(u) && o[n] && e.get(u)?.get(o[n]) && (p = e.get(u)?.get(o[n])), l.set(
        o[n],
        {
          top: h,
          height: i * p
        }
      );
    }
    r.set(u, l);
  }), r;
}
function z(e) {
  if (e.groupKey === void 0 || e.responseKey === void 0 || e.groupKey === null || e.responseKey === null || typeof e.groupKey != "string" || typeof e.responseKey != "string")
    throw new Error("groupKey and responseKey must be defined and included in config object passed to verticalSegmentViz constructor.");
  if (e.data === void 0 || e.data === null || !Array.isArray(e.data) || !e.data.every((t) => t !== null && typeof t == "object" && Object.hasOwn(t, e.groupKey) && Object.hasOwn(t, e.responseKey)))
    throw new Error("The data passed to constructor of verticalSegmentViz is either undefined or null, or has at least one row that is null, not an object, or not an object with the responseKey and groupKey you passed.");
  if (e.groups === void 0 || e.groups === null || !Array.isArray(e.groups) || e.groups.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The groups passed to the constructor of verticalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (!e.data.some((r) => t.includes(r[e.groupKey])))
      throw new Error(`In the config you passed to the verticalSegmentViz constructor, there are zero rows in the data with property ${e.groupKey} contained in group ${t}`);
  });
  const s = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!s[t].isDisjointFrom(s[r]))
        throw new Error("The groups you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of verticalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((l) => t.includes(l[e.groupKey])).filter((l) => e.responses.every((o) => !o.includes(l[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the verticalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const a = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!a[t].isDisjointFrom(a[r]))
        throw new Error("The responses you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentWidth === void 0 || e.segmentWidth === null || typeof e.segmentWidth != "number" || e.segmentVerticalPadding === void 0 || e.segmentVerticalPadding === null || typeof e.segmentVerticalPadding != "number")
    throw new Error("In the config you passed to the VerticalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentVerticalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.top plus the margin.bottom plus the vertical padding times (responses.length-1) exceeds the vizHeight.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentWidth * e.groups.length) < 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.left plus the margin.right plus the segmentWidth times groups.length exceeds the vizWidth.");
}
class f {
  //members
  P;
  X;
  Y;
  //constructor
  constructor(s) {
    z(s);
    const a = y(s.data, s.groups, s.responses, s.groupKey, s.responseKey), t = (o) => s.groups.find((i) => i.includes(o)), r = (o) => s.responses.find((i) => i.includes(o));
    this.P = (o, i) => {
      const n = t(o), h = r(i);
      if (n === void 0 || h === void 0)
        return null;
      const p = a.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : d;
    };
    const u = v(a, s.segmentWidth, s.margin, s.vizWidth);
    this.X = (o) => {
      const i = t(o);
      if (i === void 0)
        return null;
      const n = u.get(i);
      return n === void 0 ? null : {
        xLeft: n.left,
        xRight: n.left + n.width
      };
    };
    const l = c(a, s.segmentVerticalPadding, s.margin, s.vizHeight);
    this.Y = (o, i) => {
      const n = t(o), h = r(i);
      if (n === void 0 || h === void 0)
        return null;
      const p = l.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : {
        yTop: d.top,
        yBottom: d.top + d.height
      };
    };
  }
}
function S(e) {
  if (e.groupKey === void 0 || e.responseKey === void 0 || e.groupKey === null || e.responseKey === null || typeof e.groupKey != "string" || typeof e.responseKey != "string")
    throw new Error("groupKey and responseKey must be defined and included in config object passed to HorizontalSegmentViz constructor.");
  if (e.data === void 0 || e.data === null || !Array.isArray(e.data) || !e.data.every((t) => t !== null && typeof t == "object" && Object.hasOwn(t, e.groupKey) && Object.hasOwn(t, e.responseKey)))
    throw new Error("The data passed to constructor of HorizontalSegmentViz is either undefined or null, or has at least one row that is null, not an object, or not an object with the responseKey and groupKey you passed.");
  if (e.groups === void 0 || e.groups === null || !Array.isArray(e.groups) || e.groups.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The groups passed to the constructor of HorizontalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (!e.data.some((r) => t.includes(r[e.groupKey])))
      throw new Error(`In the config you passed to the HorizontalSegmentViz constructor, there are zero rows in the data with property ${e.groupKey} contained in group ${t}`);
  });
  const s = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!s[t].isDisjointFrom(s[r]))
        throw new Error("The groups you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of HorizontalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((l) => t.includes(l[e.groupKey])).filter((l) => e.responses.every((o) => !o.includes(l[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the HorizontalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const a = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!a[t].isDisjointFrom(a[r]))
        throw new Error("The responses you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentHeight === void 0 || e.segmentHeight === null || typeof e.segmentHeight != "number" || e.segmentHorizontalPadding === void 0 || e.segmentHorizontalPadding === null || typeof e.segmentHorizontalPadding != "number")
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentHorizontalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.left plus the margin.right plus the horizontal padding times (responses.length-1) exceeds the vizWidth.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentHeight * e.groups.length) < 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.top plus the margin.bottom plus the segmentHeight times groups.length exceeds the vizHeight.");
}
function b(e, s, a, t) {
  const r = Array.from(e.keys()), l = (t - a.top - a.bottom - r.length * s) / (r.length - 1), o = /* @__PURE__ */ new Map();
  for (let i = 0; i < r.length; i++) {
    let n = a.top;
    if (i > 0 && r[i - 1] && o && o.get(r[i - 1])) {
      const h = o.get(r[i - 1]);
      n = h.top + h.height + l;
    }
    o.set(r[i], {
      top: n,
      height: s
    });
  }
  return o;
}
function A(e, s, a, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((u) => {
    const l = /* @__PURE__ */ new Map(), o = Array.from(e.get(u)?.keys()), i = t - a.left - a.right - s * (o.length - 1);
    for (let n = 0; n < o.length; n++) {
      let h = a.left;
      if (n > 0 && o && o[n - 1] && l && l.get(o[n - 1])) {
        const d = l.get(o[n - 1]);
        Object.hasOwn(d, "left") && Object.hasOwn(d, "width") && (h = d.left + d.width + s);
      }
      let p = 0;
      e && e.get(u) && o[n] && e.get(u)?.get(o[n]) && (p = e.get(u)?.get(o[n])), l.set(
        o[n],
        {
          left: h,
          width: i * p
        }
      );
    }
    r.set(u, l);
  }), r;
}
class E {
  //members
  P;
  Y;
  X;
  //constructor
  constructor(s) {
    S(s);
    const a = y(s.data, s.groups, s.responses, s.groupKey, s.responseKey), t = (o) => s.groups.find((i) => i.includes(o)), r = (o) => s.responses.find((i) => i.includes(o));
    this.P = (o, i) => {
      const n = t(o), h = r(i);
      if (n === void 0 || h === void 0)
        return null;
      const p = a.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : d;
    };
    const u = b(a, s.segmentHeight, s.margin, s.vizHeight);
    this.Y = (o) => {
      const i = t(o);
      if (i === void 0)
        return null;
      const n = u.get(i);
      return n === void 0 ? null : {
        yTop: n.top,
        yBottom: n.top + n.height
      };
    };
    const l = A(a, s.segmentHorizontalPadding, s.margin, s.vizWidth);
    this.X = (o, i) => {
      const n = t(o), h = r(i);
      if (n === void 0 || h === void 0)
        return null;
      const p = l.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : {
        xLeft: d.left,
        xRight: d.left + d.width
      };
    };
  }
}
export {
  E as HorizontalSegmentViz,
  f as VerticalSegmentViz,
  V as newResponsiveSVG
};
