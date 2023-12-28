import type { MatchingConfigs } from "./types/matchings";

export const MAtCHING_CONFIG_TYPES: MatchingConfigs = {
  LABEL: false,

  SINGLE_LINE_TEXT: (k, n) => {
    return (
      n.getAttribute("type") === "text" && !n.getAttribute("allowmultivalues")
    );
  },

  EDITOR: false,

  MULTIPLE_LINE_TEXT: (k, n) => {
    return (
      n.getAttribute("type") === "text" && !!n.getAttribute("allowmultivalues")
    );
  },
  DECIMAL: "number",

  CALC: false,

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
  USER_SELECT: false,
  ORGANIZATION_SELECT: false,
  GROUP_SELECT: false,
  REFERENCE_TABLE: false,
  SPACER: false,
  HR: false,
  RECORD_ID: false,
  CREATOR: false,
  CREATED_AT: false,
  MODIFIER: false,
  MODIFIED_AT: false,
};
