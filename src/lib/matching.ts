import type { JsonObject } from "./types/Json";
import type { MatchingConfigEntry, MatchingConfigs } from "./types/matchings";

import { MATCHING_CONFIG_TYPES } from "./matchingConfig";

export const matchingName = (
  kintoneFieldInfo: JsonObject,
  notesFieldInfo: Element,
  fix?: "prefix" | "postfix"
): boolean => {
  let result = false;

  const kName = kintoneFieldInfo.var as string;
  const nName = notesFieldInfo.getAttribute("name") as string;

  if (!fix) {
    result = kName === nName;
  } else if (!kName && !nName) {
    if (fix === "postfix" && kName.match(new RegExp(`*${nName}`))) {
      result = true;
    } else if (fix === "prefix" && kName.match(new RegExp(`${nName}*`))) {
      result = true;
    } else {
      result = false;
    }
  }

  return result;
};

export const matchingType = (
  kintoneField: JsonObject,
  notesField: Element,
  configs?: MatchingConfigEntry | MatchingConfigs
): boolean | null => {
  if (configs === undefined) {
    return false;
  }

  if (configs === null) {
    return null;
  } else if (typeof configs === "boolean") {
    return false;
  } else if (typeof configs === "string") {
    return configs === notesField.getAttribute("type");
  } else if (typeof configs === "function") {
    return configs(kintoneField, notesField);
  } else if (typeof configs === "object") {
    const kType = kintoneField.type as string;
    const config = configs[kType];

    if (config === null) {
      return null;
    } else {
      return matchingType(kintoneField, notesField, config);
    }
  } else {
    return false;
  }
};

export const getMatchingAll = (
  configs: MatchingConfigs = MATCHING_CONFIG_TYPES
) => {
  //const configs = MATCHING_CONFIG_TYPES;
  return [
    (k: JsonObject, n: Element) => {
      return matchingName(k, n) && matchingType(k, n, configs);
    },
    (k: JsonObject, n: Element) => {
      return matchingName(k, n, "postfix") && matchingType(k, n, configs);
    },
    (k: JsonObject, n: Element) => {
      return matchingName(k, n, "prefix") && matchingType(k, n, configs);
    },
    (k: JsonObject, n: Element) => {
      return matchingName(k, n);
    },
    (k: JsonObject, n: Element) => {
      return matchingName(k, n, "postfix");
    },
    (k: JsonObject, n: Element) => {
      return matchingName(k, n, "prefix");
    },
    (k: JsonObject, n: Element) => {
      return matchingType(k, n);
    },
  ];
};
