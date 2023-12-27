<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import readAsText from "@/lib/readAsText";

type JsonPrimitive = string | number | boolean | null;

type JsonArray = JsonPrimitive[] | JsonObject[];

type JsonObject = {
  [key: string]: JsonPrimitive | JsonObject | JsonArray;
};

type Json = JsonPrimitive | JsonArray | JsonObject;

const getFields = (app: JsonObject): JsonObject[] => {
  //if (!app.schema) return [];

  const schema = app.schema as JsonObject;
  const table = schema.table as JsonObject;
  const fieldList = table.fieldList as JsonObject;

  const fields: JsonObject[] = Object.entries(fieldList).map(([key, value]) => {
    //const id = key;
    const field = value as JsonObject;

    return field;
  });

  return fields;
};

const setup = () => {
  const local = reactive({
    json: ref(),
    appName: ref(),
  });
  const model = reactive({
    txaValue: ref(""),
  });

  const doChangeFile = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!event.currentTarget) return;

    const target = event.currentTarget as HTMLInputElement;

    if (!target.files) return;

    const file = target.files[0];

    if (!(file instanceof Blob)) {
      return;
    }

    readAsText(file, "UTF-8").then((reader) => {
      const result = reader.result as string;

      const json = JSON.parse(result);
      const app = json.apps[0];
      const fields = getFields(app);

      //console.log("fields=", fields);

      let txaValue = "";

      fields.forEach((field) => {
        txaValue += field.var + "\t" + field.type + "\n";
      });

      local.json = json;
      local.appName = json.name;
      model.txaValue = txaValue;
    });
  };

  const doClickCopy = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const elem = document.getElementById("txa-kintone");

    if (elem) {
      const txa = elem as HTMLTextAreaElement;
      txa.select();
      navigator.clipboard.writeText(txa.value);
    }
  };
  return {
    local,
    model,
    doChangeFile,
    doClickCopy,
  };
};

export default defineComponent({
  name: "o-kintone-info",
  setup,
});
</script>

<template src="./OKintoneInfo.html"></template>
