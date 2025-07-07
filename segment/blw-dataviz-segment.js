function m(e, n, l, t, r) {
  const d = /* @__PURE__ */ new Map();
  return n.forEach((i) => {
    const s = /* @__PURE__ */ new Map(), a = e.filter((o) => i.includes(o[t])).length;
    if (a === 0)
      throw new Error(`There are no rows in the data with values at key ${t} in array ${i}`);
    l.forEach((o) => {
      const u = e.filter((p) => o.includes(p[r]) && i.includes(p[t])).length;
      s.set(
        o,
        u / a
      );
    }), d.set(i, s);
  }), d;
}
function y(e, n, l, t) {
  const r = Array.from(e.keys()), i = (t - l.left - l.right - r.length * n) / (r.length - 1), s = /* @__PURE__ */ new Map();
  for (let a = 0; a < r.length; a++) {
    let o = l.left;
    if (a > 0 && r && r[a - 1] && s && s.get(r[a - 1])) {
      let u = s.get(r[a - 1]);
      o = u.left + u.width + i;
    }
    s.set(r[a], {
      left: o,
      width: n
    });
  }
  return s;
}
function g(e, n, l, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((d) => {
    const i = /* @__PURE__ */ new Map(), s = Array.from(e.get(d)?.keys()), a = t - l.top - l.bottom - n * (s.length - 1);
    for (let o = 0; o < s.length; o++) {
      let u = l.top;
      if (o > 0 && s && s[o - 1] && i && i.get(s[o - 1])) {
        const h = i.get(s[o - 1]);
        u = h.top + h.height + n;
      }
      let p = 0;
      e && e.get(d) && s[o] && e.get(d)?.get(s[o]) && (p = e.get(d)?.get(s[o])), i.set(
        s[o],
        {
          top: u,
          height: a * p
        }
      );
    }
    r.set(d, i);
  }), r;
}
function v(e) {
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
  const n = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!n[t].isDisjointFrom(n[r]))
        throw new Error("The groups you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of verticalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((i) => t.includes(i[e.groupKey])).filter((i) => e.responses.every((s) => !s.includes(i[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the verticalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const l = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!l[t].isDisjointFrom(l[r]))
        throw new Error("The responses you passed to the verticalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentWidth === void 0 || e.segmentWidth === null || typeof e.segmentWidth != "number" || e.segmentVerticalPadding === void 0 || e.segmentVerticalPadding === null || typeof e.segmentVerticalPadding != "number")
    throw new Error("In the config you passed to the VerticalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentVerticalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.top plus the margin.bottom plus the vertical padding times (responses.length-1) exceeds the vizHeight.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentWidth * e.groups.length) < 0)
    throw new Error("In the config you passed to the verticalSegmentViz constructor, the margin.left plus the margin.right plus the segmentWidth times groups.length exceeds the vizWidth.");
}
class S {
  //members
  P;
  X;
  Y;
  //constructor
  constructor(n) {
    v(n);
    const l = m(n.data, n.groups, n.responses, n.groupKey, n.responseKey), t = (s) => n.groups.find((a) => a.includes(s)), r = (s) => n.responses.find((a) => a.includes(s));
    this.P = (s, a) => {
      const o = t(s), u = r(a);
      if (o === void 0 || u === void 0)
        return null;
      const p = l.get(o);
      if (p === void 0)
        return null;
      const h = p.get(u);
      return h === void 0 ? null : h;
    };
    const d = y(l, n.segmentWidth, n.margin, n.vizWidth);
    this.X = (s) => {
      const a = t(s);
      if (a === void 0)
        return null;
      const o = d.get(a);
      return o === void 0 ? null : {
        xLeft: o.left,
        xRight: o.left + o.width
      };
    };
    const i = g(l, n.segmentVerticalPadding, n.margin, n.vizHeight);
    this.Y = (s, a) => {
      const o = t(s), u = r(a);
      if (o === void 0 || u === void 0)
        return null;
      const p = i.get(o);
      if (p === void 0)
        return null;
      const h = p.get(u);
      return h === void 0 ? null : {
        yTop: h.top,
        yBottom: h.top + h.height
      };
    };
  }
}
function w(e) {
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
  const n = e.groups.map((t) => new Set(t));
  for (let t = 0; t < e.groups.length - 1; t++)
    for (let r = t + 1; r < e.groups.length; r++)
      if (!n[t].isDisjointFrom(n[r]))
        throw new Error("The groups you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.responses === void 0 || e.responses === null || !Array.isArray(e.responses) || e.responses.some((t) => t === null || !Array.isArray(t) || t.some((r) => r === null || typeof r != "string")))
    throw new Error("The responses passed to the constructor of HorizontalSegmentViz is either undefined or null, or is not an array.  Or one or more of it's entries is not an array of strings. ");
  e.groups.forEach((t) => {
    if (e.data.filter((i) => t.includes(i[e.groupKey])).filter((i) => e.responses.every((s) => !s.includes(i[e.responseKey]))).length > 0)
      throw new Error(`In the data you passed to the HorizontalSegmentViz constructor, there are rows in group ${t} that are not included in any of the response you passed to the config.`);
  });
  const l = e.responses.map((t) => new Set(t));
  for (let t = 0; t < e.responses.length - 1; t++)
    for (let r = t + 1; r < e.responses.length; r++)
      if (!l[t].isDisjointFrom(l[r]))
        throw new Error("The responses you passed to the HorizontalSegmentViz constructor are not mutually exclusive.");
  if (e.margin === void 0 || e.margin === null || ["top", "right", "bottom", "left"].some((t) => !Object.hasOwn(e.margin, t) || e.margin[t] === void 0 || e.margin[t] === null || typeof e.margin[t] != "number") || e.vizWidth === void 0 || e.vizWidth === null || typeof e.vizWidth != "number" || e.vizHeight === void 0 || e.vizHeight === null || typeof e.vizHeight != "number" || e.segmentHeight === void 0 || e.segmentHeight === null || typeof e.segmentHeight != "number" || e.segmentHorizontalPadding === void 0 || e.segmentHorizontalPadding === null || typeof e.segmentHorizontalPadding != "number")
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, either margin is undefined, null, or does not have the required proporties, or one or more of the required properties are not numbers, or vizWidth, vizHeight, segmentWidth, or segmentHeight are null, undefined or not numbers.");
  if (e.vizWidth - (e.margin.left + e.margin.right + e.segmentHorizontalPadding * (e.responses.length - 1)) <= 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.left plus the margin.right plus the horizontal padding times (responses.length-1) exceeds the vizWidth.");
  if (e.vizHeight - (e.margin.top + e.margin.bottom + e.segmentHeight * e.groups.length) < 0)
    throw new Error("In the config you passed to the HorizontalSegmentViz constructor, the margin.top plus the margin.bottom plus the segmentHeight times groups.length exceeds the vizHeight.");
}
function z(e, n, l, t) {
  const r = Array.from(e.keys()), i = (t - l.top - l.bottom - r.length * n) / (r.length - 1), s = /* @__PURE__ */ new Map();
  for (let a = 0; a < r.length; a++) {
    let o = l.top;
    if (a > 0 && r[a - 1] && s && s.get(r[a - 1])) {
      const u = s.get(r[a - 1]);
      o = u.top + u.height + i;
    }
    s.set(r[a], {
      top: o,
      height: n
    });
  }
  return s;
}
function c(e, n, l, t) {
  const r = /* @__PURE__ */ new Map();
  return Array.from(e.keys()).forEach((d) => {
    const i = /* @__PURE__ */ new Map(), s = Array.from(e.get(d)?.keys()), a = t - l.left - l.right - n * (s.length - 1);
    for (let o = 0; o < s.length; o++) {
      let u = l.left;
      if (o > 0 && s && s[o - 1] && i && i.get(s[o - 1])) {
        const h = i.get(s[o - 1]);
        Object.hasOwn(h, "left") && Object.hasOwn(h, "width") && (u = h.left + h.width + n);
      }
      let p = 0;
      e && e.get(d) && s[o] && e.get(d)?.get(s[o]) && (p = e.get(d)?.get(s[o])), i.set(
        s[o],
        {
          left: u,
          width: a * p
        }
      );
    }
    r.set(d, i);
  }), r;
}
class b {
  //members
  P;
  Y;
  X;
  //constructor
  constructor(n) {
    w(n);
    const l = m(n.data, n.groups, n.responses, n.groupKey, n.responseKey), t = (s) => n.groups.find((a) => a.includes(s)), r = (s) => n.responses.find((a) => a.includes(s));
    this.P = (s, a) => {
      const o = t(s), u = r(a);
      if (o === void 0 || u === void 0)
        return null;
      const p = l.get(o);
      if (p === void 0)
        return null;
      const h = p.get(u);
      return h === void 0 ? null : h;
    };
    const d = z(l, n.segmentHeight, n.margin, n.vizHeight);
    this.Y = (s) => {
      const a = t(s);
      if (a === void 0)
        return null;
      const o = d.get(a);
      return o === void 0 ? null : {
        yTop: o.top,
        yBottom: o.top + o.height
      };
    };
    const i = c(l, n.segmentHorizontalPadding, n.margin, n.vizWidth);
    this.X = (s, a) => {
      const o = t(s), u = r(a);
      if (o === void 0 || u === void 0)
        return null;
      const p = i.get(o);
      if (p === void 0)
        return null;
      const h = p.get(u);
      return h === void 0 ? null : {
        xLeft: h.left,
        xRight: h.left + h.width
      };
    };
  }
}
export {
  b as HorizontalSegmentViz,
  S as VerticalSegmentViz
};
