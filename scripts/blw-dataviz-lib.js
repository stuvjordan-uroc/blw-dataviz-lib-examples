function w(e = 6) {
  const o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let i = "";
  for (let t = 0; t < e; t++)
    i += o.charAt(Math.floor(Math.random() * o.length));
  return i;
}
function m(e, o, i) {
  e.setAttribute("width", o.toString()), e.setAttribute("height", Math.round(o / i).toString());
}
function y(e) {
  let o = e.clientWidth;
  const i = getComputedStyle(e).getPropertyValue("padding");
  if (i && i.length > 0) {
    const t = i.split(" ");
    o = o - parseFloat(t[1]) - parseFloat(t[3]);
  }
  return o;
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
  const o = typeof e.maxXCoord == "number" ? e.maxXCoord : parseFloat(e.maxXCoord), i = typeof e.maxYCoord == "number" ? e.maxYCoord : parseFloat(e.maxYCoord);
  if (o <= 0 || i <= 0)
    throw new Error("The maxXCoord and maxYCoord properties of the config passed to newResponseiveSVG must be strictly greater than 0.");
  const t = o / i, u = document.createElementNS("http://www.w3.org/2000/svg", "svg"), l = w();
  u.setAttribute("id", l), u.setAttribute("width", o.toString()), u.setAttribute("height", i.toString()), u.setAttribute("viewBox", `0 0 ${o.toString()} ${i.toString()}`), u.setAttribute("preserveAspectRatio", "xMinYMid");
  const s = document.getElementById(e.containerId);
  if (!s)
    return console.log(`newResponsiveSVG cannot locate element with id ${e.containerId}`), null;
  let a = y(s);
  return isNaN(a) ? (console.log(`new responsive SVG got NAN when it tried to get the width of ${s}`), null) : (m(u, a, t), window.addEventListener("resize", () => {
    const n = document.getElementById(e.containerId);
    if (!n)
      throw new Error(`We detected a window resize, and thus tried to resize an svg created with newResponseiveSVG.  But you passed the containerId ${e.containerId} to newResponsiveSVG and we cannot find an element in the document with that id.`);
    let h = y(n);
    if (isNaN(h))
      throw new Error(`We detected a resize, and thus tried to resize an svg created with newResponseiveSVG. But got NAN when we tried to get the width of ${n}`);
    m(u, h, t);
  }), s.appendChild(u), l);
}
function g(e, o, i, t, r) {
  const u = /* @__PURE__ */ new Map();
  return o.forEach((l) => {
    const s = /* @__PURE__ */ new Map(), a = e.filter((n) => l.includes(n[t])).length;
    if (a === 0)
      throw new Error(`There are no rows in the data with values at key ${t} in array ${l}`);
    i.forEach((n) => {
      const h = e.filter((p) => n.includes(p[r]) && l.includes(p[t])).length;
      s.set(
        n,
        h / a
      );
    }), u.set(l, s);
  }), u;
}
function v(e, o, i, t) {
  const r = Array.from(e.keys()), l = (t - i.left - i.right - r.length * o) / (r.length - 1), s = /* @__PURE__ */ new Map();
  for (let a = 0; a < r.length; a++) {
    let n = i.left;
    if (a > 0 && r && r[a - 1] && s && s.get(r[a - 1])) {
      let h = s.get(r[a - 1]);
      n = h.left + h.width + l;
    }
    s.set(r[a], {
      left: n,
      width: o
    });
  }
  return s;
}
function c(e, o, i, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((u) => {
    const l = /* @__PURE__ */ new Map(), s = Array.from(e.get(u)?.keys()), a = t - i.top - i.bottom - o * (s.length - 1);
    for (let n = 0; n < s.length; n++) {
      let h = i.top;
      if (n > 0 && s && s[n - 1] && l && l.get(s[n - 1])) {
        const d = l.get(s[n - 1]);
        h = d.top + d.height + o;
      }
      let p = 0;
      e && e.get(u) && s[n] && e.get(u)?.get(s[n]) && (p = e.get(u)?.get(s[n])), l.set(
        s[n],
        {
          top: h,
          height: a * p
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
  const o = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!o[t].isDisjointFrom(o[r]))
        throw new Error("The groups you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of verticalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((l) => t.includes(l[e.groupKey])).filter((l) => e.responses.every((s) => !s.includes(l[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the verticalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const i = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!i[t].isDisjointFrom(i[r]))
        throw new Error("The responses you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentWidth === void 0 || e.segmentWidth === null || typeof e.segmentWidth != "number" || e.segmentVerticalPadding === void 0 || e.segmentVerticalPadding === null || typeof e.segmentVerticalPadding != "number")
    throw new Error("In the config you passed to the VerticalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentVerticalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.top plus the margin.bottom plus the vertical padding times (responses.length-1) exceeds the vizHeight.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentWidth * e.groups.length) < 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.left plus the margin.right plus the segmentWidth times groups.length exceeds the vizWidth.");
}
class H {
  //members
  P;
  X;
  Y;
  //constructor
  constructor(o) {
    z(o);
    const i = g(o.data, o.groups, o.responses, o.groupKey, o.responseKey), t = (s) => o.groups.find((a) => a.includes(s)), r = (s) => o.responses.find((a) => a.includes(s));
    this.P = (s, a) => {
      const n = t(s), h = r(a);
      if (n === void 0 || h === void 0)
        return null;
      const p = i.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : d;
    };
    const u = v(i, o.segmentWidth, o.margin, o.vizWidth);
    this.X = (s) => {
      const a = t(s);
      if (a === void 0)
        return null;
      const n = u.get(a);
      return n === void 0 ? null : {
        xLeft: n.left,
        xRight: n.left + n.width
      };
    };
    const l = c(i, o.segmentVerticalPadding, o.margin, o.vizHeight);
    this.Y = (s, a) => {
      const n = t(s), h = r(a);
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
  const o = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!o[t].isDisjointFrom(o[r]))
        throw new Error("The groups you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of HorizontalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((l) => t.includes(l[e.groupKey])).filter((l) => e.responses.every((s) => !s.includes(l[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the HorizontalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const i = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!i[t].isDisjointFrom(i[r]))
        throw new Error("The responses you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentHeight === void 0 || e.segmentHeight === null || typeof e.segmentHeight != "number" || e.segmentHorizontalPadding === void 0 || e.segmentHorizontalPadding === null || typeof e.segmentHorizontalPadding != "number")
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentHorizontalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.left plus the margin.right plus the horizontal padding times (responses.length-1) exceeds the vizWidth.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentHeight * e.groups.length) < 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.top plus the margin.bottom plus the segmentHeight times groups.length exceeds the vizHeight.");
}
function b(e, o, i, t) {
  const r = Array.from(e.keys()), l = (t - i.top - i.bottom - r.length * o) / (r.length - 1), s = /* @__PURE__ */ new Map();
  for (let a = 0; a < r.length; a++) {
    let n = i.top;
    if (a > 0 && r[a - 1] && s && s.get(r[a - 1])) {
      const h = s.get(r[a - 1]);
      n = h.top + h.height + l;
    }
    s.set(r[a], {
      top: n,
      height: o
    });
  }
  return s;
}
function A(e, o, i, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((u) => {
    const l = /* @__PURE__ */ new Map(), s = Array.from(e.get(u)?.keys()), a = t - i.left - i.right - o * (s.length - 1);
    for (let n = 0; n < s.length; n++) {
      let h = i.left;
      if (n > 0 && s && s[n - 1] && l && l.get(s[n - 1])) {
        const d = l.get(s[n - 1]);
        Object.hasOwn(d, "left") && Object.hasOwn(d, "width") && (h = d.left + d.width + o);
      }
      let p = 0;
      e && e.get(u) && s[n] && e.get(u)?.get(s[n]) && (p = e.get(u)?.get(s[n])), l.set(
        s[n],
        {
          left: h,
          width: a * p
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
  constructor(o) {
    S(o);
    const i = g(o.data, o.groups, o.responses, o.groupKey, o.responseKey), t = (s) => o.groups.find((a) => a.includes(s)), r = (s) => o.responses.find((a) => a.includes(s));
    this.P = (s, a) => {
      const n = t(s), h = r(a);
      if (n === void 0 || h === void 0)
        return null;
      const p = i.get(n);
      if (p === void 0)
        return null;
      const d = p.get(h);
      return d === void 0 ? null : d;
    };
    const u = b(i, o.segmentHeight, o.margin, o.vizHeight);
    this.Y = (s) => {
      const a = t(s);
      if (a === void 0)
        return null;
      const n = u.get(a);
      return n === void 0 ? null : {
        yTop: n.top,
        yBottom: n.top + n.height
      };
    };
    const l = A(i, o.segmentHorizontalPadding, o.margin, o.vizWidth);
    this.X = (s, a) => {
      const n = t(s), h = r(a);
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
  H as VerticalSegmentViz,
  V as newResponsiveSVG
};
