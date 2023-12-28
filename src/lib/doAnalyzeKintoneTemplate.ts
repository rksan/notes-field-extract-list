import type { JsonObject, JsonPrimitive } from "./types/Json";

export const getFormEntry = (app: JsonObject): JsonObject => {
  const form = app.form as JsonObject;

  if (!form) {
    return {};
  }

  return form;
};

const doAnalyzeColl = (item: JsonObject): JsonObject[] => {
  const type = item.type as JsonPrimitive;

  if (typeof type === "string") {
    switch (type.toUpperCase()) {
      case "ROW":
        return doAnalyzeRow(item);
      case "GROUP":
        return doAnalyzeGroup(item);
      case "SUBTABLE":
        return doAnalyzeSubTable(item);
      default:
        return doAnalyzeOther(item);
    }
  } else {
    return [];
  }
};

const doAnalyzeRow = (row: JsonObject) => {
  const controlList = row.controlList as JsonObject[];

  return doAnalyzeControlList(controlList);
};

const doAnalyzeSubTable = (subTable: JsonObject) => {
  const controlList = subTable.controlList as JsonObject[];

  return doAnalyzeControlList(controlList);
};

const doAnalyzeControlList = (controlList: JsonObject[]): JsonObject[] => {
  return Array.from(controlList)
    .map((item) => doAnalyzeColl(item))
    .flat();
};

const doAnalyzeGroup = (group: JsonObject): JsonObject[] => {
  const canvasData = group.canvasData as JsonObject[];

  return doAnalyzeCanvasData(canvasData);
};

const doAnalyzeCanvasData = (canvasData: JsonObject[]): JsonObject[] => {
  return Array.from(canvasData)
    .map((item) => doAnalyzeColl(item))
    .flat();
};

const doAnalyzeOther = (other: JsonObject): JsonObject[] => {
  return [other];
};

const doAnalyzeLayout = (layouts: JsonObject[]): JsonObject[] => {
  return Array.from(layouts)
    .map((item) => doAnalyzeColl(item))
    .flat();
};

export const doAnalyzeForm = (form: JsonObject): JsonObject[] => {
  const layout = JSON.parse(form.layout as string) as JsonObject[];

  return doAnalyzeLayout(layout);
};
