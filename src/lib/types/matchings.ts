import type { JsonObject } from "./Json";

export type MatchingConfigEntry =
  | boolean
  | string
  | {
      (kintoneFieldInfo: JsonObject, notesFieldInfo: Element): boolean;
    };

export type MatchingConfigs = {
  [key: string]: MatchingConfigEntry;
};
