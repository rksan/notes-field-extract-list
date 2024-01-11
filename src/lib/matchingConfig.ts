import type { MatchingConfigs } from "./types/matchings";

export const MATCHING_CONFIG_TYPES: MatchingConfigs = {
  LABEL: null,

  SINGLE_LINE_TEXT: (k, n) => {
    return (
      n.getAttribute("type") === "text" && !n.getAttribute("allowmultivalues")
    );
  },

  EDITOR: "richtext",

  MULTIPLE_LINE_TEXT: (k, n) => {
    return (
      n.getAttribute("type") === "text" && !!n.getAttribute("allowmultivalues")
    );
  },

  DECIMAL: "number",

  CALC: (k, n) => {
    return (
      n.getAttribute("type") === "text" && n.getAttribute("kind") === "computed"
    );
  },

  SINGLE_CHECK: "radiobutton",

  MULTIPLE_CHECK: "checkbox",

  MULTIPLE_SELECT: (k, n) => {
    return (
      n.getAttribute("type") === "keyword" &&
      !!n.getAttribute("allowmultivalues")
    );
  },

  SINGLE_SELECT: (k, n) => {
    return (
      n.getAttribute("type") === "keyword" &&
      !n.getAttribute("allowmultivalues")
    );
  },

  DATE: (k, n) => {
    const dateformat = n.querySelector("dateformat");
    const date = dateformat?.getAttribute("date");
    const time = dateformat?.getAttribute("time");

    return n.getAttribute("type") === "datetime" && !!date && !time;
  },

  TIME: (k, n) => {
    const dateformat = n.querySelector("dateformat");
    const date = dateformat?.getAttribute("date");
    const time = dateformat?.getAttribute("time");

    return n.getAttribute("type") === "datetime" && !date && !!time;
  },

  DATETIME: (k, n) => {
    const dateformat = n.querySelector("dateformat");
    const date = dateformat?.getAttribute("date");
    const time = dateformat?.getAttribute("time");

    return n.getAttribute("type") === "datetime" && !!date && !!time;
  },

  FILE: false,

  LINK: false,

  USER_SELECT: "names",

  ORGANIZATION_SELECT: false,

  GROUP_SELECT: false,

  REFERENCE_TABLE: false,

  SPACER: false,

  HR: null,

  RECORD_ID: false,

  CREATOR: false,

  CREATED_AT: false,

  MODIFIER: false,

  MODIFIED_AT: false,

  GROUP: false,

  SUBTABLE: false,
};
