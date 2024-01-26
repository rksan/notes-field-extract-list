<script lang="ts">
import { ComponentOptions } from "vue";
import { defineComponent, reactive, ref } from "vue";

import readAsText from "@/lib/readAsText";

import { JsonObject, JsonPrimitive } from "@/lib/types/Json";
import { getFormEntry, doAnalyzeForm } from "@/lib/doAnalyzeKintoneTemplate";
import type { MatchingConfigs } from "@/lib/types/matchings";
import { MATCHING_CONFIG_TYPES } from "@/lib/matchingConfig";

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

    case "EDITOR":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "RTCH_TEXT",
      ];
      break;

    case "MULTIPLE_LINE_TEXT":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "MULTI_LINE_TEXT",
      ];
      break;

    case "DECIMAL":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "NUMBER",
      ];
      break;

    case "SINGLE_CHECK":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "RADIO_BUTTON",
      ];
      break;

    case "MULTIPLE_CHECK":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "CHECK_BOX",
      ];
      break;

    case "MULTIPLE_SELECT":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "MULTI_SELECT",
      ];
      break;

    case "SINGLE_SELECT":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "DROP_DOWN",
      ];
      break;

    case "SPACER":
      infos = [
        control.elementId as JsonPrimitive,
        control.label as JsonPrimitive,
        control.type as JsonPrimitive,
      ];
      break;

    case "RECORD_ID":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "RECORD_NUMBER",
      ];
      break;

    case "CREATED_AT":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "CREATED_TIME",
      ];
      break;

    case "MODIFIED_AT":
      infos = [
        control.var as JsonPrimitive,
        control.label as JsonPrimitive,
        "MODIFIED_TIME",
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
  type LocalMember = {
    json?: JsonObject;
    controls?: JsonObject[];
    fieldTypes: string[];
    configs: MatchingConfigs;
  };
  const local: LocalMember = {
    json: undefined,
    controls: undefined,
    fieldTypes: Object.entries(MATCHING_CONFIG_TYPES).map(([key]) => {
      return key;
    }),
    configs: MATCHING_CONFIG_TYPES,
  };

  const model = reactive({
    appNames: ref(),
    appName: ref(),
    fieldTypes: ref(
      Object.entries(MATCHING_CONFIG_TYPES).map(([key, value]) => {
        return value !== null ? key : "";
      })
    ),
    selectApp: ref(),
    txaValue: ref(""),
  });

  const reset = () => {
    model.appName = "";
    model.selectApp = "";
    model.txaValue = "";
  };

  const updateConfig = (): MatchingConfigs => {
    const fieldTypes = model.fieldTypes;
    const configs: MatchingConfigs = {};

    local.fieldTypes.forEach((type) => {
      if (fieldTypes.includes(type)) {
        const config = MATCHING_CONFIG_TYPES[type];
        if (config === null) {
          configs[type] = false;
        } else {
          configs[type] = MATCHING_CONFIG_TYPES[type];
        }
      } else {
        configs[type] = null;
      }
    });

    local.configs = configs;

    return configs;
  };

  const updateControls = (): JsonObject[] | undefined => {
    const json = local.json;

    if (!json) return;

    if (model.selectApp === "") return;

    const idx = Number(model.selectApp);

    const apps = json.apps as JsonObject[];

    const app = apps[idx];

    const form = getFormEntry(app);

    const configs = updateConfig();

    const controls = doAnalyzeForm(form).filter((control) => {
      const type = control.type as string;
      if (configs[type] === null) {
        return false;
      } else {
        return true;
      }
    });

    local.controls = controls;

    return controls;
  };

  const updateTxa = () => {
    const controls = local.controls;
    let txaValue = "";

    if (controls) {
      Array.from(controls).forEach((item) => {
        const controlInfo = getControlInfo(item);

        txaValue += controlInfo.join("\t") + "\n";
      });
    }

    model.txaValue = txaValue;
  };

  const doEmitUpdateFildes = () => {
    const fields = local.controls;
    const configs = local.configs;

    emit("update-fields", { fields, configs });
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

    reset();

    readAsText(file, "UTF-8").then((reader) => {
      const result = reader.result as string;

      const json = JSON.parse(result);
      const appNames: string[] = [];

      Array.from(json.apps as JsonObject[]).forEach((app) => {
        const info = app.info as JsonObject;
        const name = info.name as string;
        appNames.push(name);
      });

      local.json = json;
      model.appNames = appNames;
    });
  };

  const doChangeFieldTypes = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    updateControls();

    updateTxa();

    doEmitUpdateFildes();
  };

  const doChangeAppName = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    updateControls();

    updateTxa();

    doEmitUpdateFildes();
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
    doChangeFieldTypes,
    doChangeAppName,
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
