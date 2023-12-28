<script lang="ts">
import { ComponentOptions } from "vue";
import { defineComponent, reactive, ref } from "vue";

import readAsText from "@/lib/readAsText";

import { JsonObject, JsonPrimitive } from "@/lib/types/Json";
import { getFormEntry, doAnalyzeForm } from "@/lib/doAnalyzeKintoneTemplate";

const getControlInfo = (control: JsonObject) => {
  const type = control.type as string;
  let infos: JsonPrimitive[];
  switch (type.toUpperCase()) {
    case "LABEL":
      infos = [
        control.formatted as JsonPrimitive,
        control.label as JsonPrimitive,
        control.type as JsonPrimitive,
      ];
      break;

    default:
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        control.type as JsonPrimitive,
      ];
      break;
  }
  return infos;
};

const emits: ComponentOptions["emits"] = ["update-fields"];

const setup: ComponentOptions["setup"] = ($props, { emit }) => {
  const local = reactive({
    json: ref(),
    appName: ref(),
    controls: ref(),
  });
  const model = reactive({
    txaValue: ref(""),
  });

  const doEmitUpdateFilles = () => {
    const fields = local.controls;
    emit("update-fields", { fields });
  };

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
      const form = getFormEntry(app);
      const controls = doAnalyzeForm(form);

      let txaValue = "";

      Array.from(controls).forEach((item) => {
        const controlInfo = getControlInfo(item);

        txaValue += controlInfo.join("\t") + "\n";
      });

      local.json = json;
      local.appName = json.name;
      local.controls = controls;
      model.txaValue = txaValue;

      doEmitUpdateFilles();
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
  emits,
  setup,
});
</script>

<template src="./OKintoneInfo.html"></template>
