import type { JsonObject } from "./types/Json";
import type { MatchingConfigs } from "./types/matchings";

import { getMatchingAll, matchingType } from "./matching";
import { MATCHING_CONFIG_TYPES } from "./matchingConfig";

export interface FieldInfo {
  toArray(): string[];
  toString(separator?: string): string;
}

class CFieldInfo implements FieldInfo {
  #kintoneField;
  #notesField;

  constructor(kintoneField: JsonObject, notesField?: Element) {
    this.#kintoneField = kintoneField;
    this.#notesField = notesField;
  }

  toArray(): string[] {
    type Info = {
      [key: string]: string;
    };

    const kintoneInfo: Info = ((): Info => {
      const type = this.#kintoneField.type as string;
      if (type.toUpperCase() === "LABEL") {
        return {
          label: this.#kintoneField.label as string,
          code: this.#kintoneField.formatted as string,
          type: this.#kintoneField.type as string,
        };
      } else {
        return {
          label: this.#kintoneField.label as string,
          code: this.#kintoneField.var as string,
          type: this.#kintoneField.type as string,
        };
      }
    })();

    const notesInfo: Info = ((): Info => {
      const field = this.#notesField;
      if (field) {
        const allowmultivalues = field.getAttribute(
          "allowmultivalues"
        ) as string;

        if (allowmultivalues === "true") {
          return {
            name: field.getAttribute("name") as string,
            type: (field.getAttribute("type") + "list") as string,
            allowmultivalues,
          };
        } else {
          return {
            name: field.getAttribute("name") as string,
            type: (field.getAttribute("type") + "list") as string,
          };
        }
      } else {
        return {
          name: "",
          type: "",
        };
      }
    })();

    const cols = [
      kintoneInfo.label,
      kintoneInfo.code,
      kintoneInfo.type,
      notesInfo.name,
      notesInfo.type,
    ];

    return cols;
  }

  toString(separator?: string): string {
    const cols = this.toArray();
    return cols.join(separator || "\t");
  }
}

export interface FieldMapping {
  labels: string[];
  result: FieldInfo[];
  toArray(): string[][];
  toString(separator?: string): string;
}

class CFieldMapping implements FieldMapping {
  #kintoneFields;
  #notesFields;
  #result: FieldInfo[];
  #labels: string[];

  constructor(kintoneFields: JsonObject[], notesFields: Element[]) {
    this.#kintoneFields = kintoneFields;
    this.#notesFields = notesFields;
    this.#result = [];
    this.#labels = [
      "kintone-field-label",
      "kintone-field-code",
      "kintone-field-type",
      "notes-field-name",
      "notes-field-type",
    ];
  }

  get result() {
    return this.#result;
  }

  get labels() {
    return this.#labels;
  }

  do(options: { matchings?: MatchingConfigs; configs: MatchingConfigs }) {
    const notesFields = Array.from(this.#notesFields);
    let kintoneFields = Array.from(this.#kintoneFields);

    const matchedInfo: { [code: string]: Element } = {};

    if (options.matchings !== undefined) {
      const matchings = options.matchings;
      kintoneFields = kintoneFields.filter((kintoneField: JsonObject) => {
        const kCode = kintoneField.var as string;
        const config = matchings[kCode];

        if (
          config === null ||
          config === undefined ||
          typeof config === "boolean"
        ) {
          // unmatch
          return true;
        }

        const idx = notesFields.findIndex((notesField) => {
          if (notesField) {
            return matchingType(kintoneField, notesField, config);
          } else {
            return false;
          }
        });

        if (0 < idx) {
          // match
          matchedInfo[kCode] = notesFields[idx];
          delete notesFields[idx];
          return false;
        } else {
          // unmatch
          return true;
        }
      });
    }

    if (0 < kintoneFields.length && 0 < notesFields.length) {
      const matchingAll = getMatchingAll(options.configs);

      matchingAll.forEach((matching) => {
        if (0 < kintoneFields.length && 0 < notesFields.length)
          kintoneFields = kintoneFields.filter((kintoneField) => {
            const kCode = kintoneField.var as string;

            const idx = notesFields.findIndex(
              (notesField) => notesField && matching(kintoneField, notesField)
            );

            if (0 < idx) {
              // match
              matchedInfo[kCode] = notesFields[idx];
              delete notesFields[idx];
              return false;
            }

            // unmatch
            return true;
          });
      });
    }

    Array.from(this.#kintoneFields).forEach((kintoneField) => {
      const kType = kintoneField.type as string;

      if (MATCHING_CONFIG_TYPES[kType] === null) {
        // none.
      } else {
        const kCode = kintoneField.var as string;
        const notesField = matchedInfo[kCode];
        const fieldInfo = new CFieldInfo(kintoneField, notesField);
        this.#result.push(fieldInfo);
      }
    });
  }

  toArray(): string[][] {
    return this.#result.concat().map((info) => info.toArray());
  }

  toString(separator?: string): string {
    return this.#result
      .concat()
      .map((info) => info.toString(separator))
      .join("\n");
  }
}

export const fieldMapping = (
  kintoneFields: JsonObject[],
  notesFields: Element[],
  options: {
    matchings?: MatchingConfigs;
    configs: MatchingConfigs;
  }
): FieldMapping => {
  const mapping = new CFieldMapping(kintoneFields, notesFields);
  mapping.do(options);
  return mapping;
};
