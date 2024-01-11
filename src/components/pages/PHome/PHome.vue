<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import {
  OKintoneInfoVue,
  ONotesInfoVue,
  OTableVue,
} from "@/components/organisms";
import { FieldMapping, fieldMapping } from "@/lib/mapping";
import type { JsonObject } from "@/lib/types/Json";
import type { MatchingConfigs } from "@/lib/types/matchings";
import { MATCHING_CONFIG_TYPES } from "@/lib/matchingConfig";

const setup = () => {
  type LocalMember = {
    kintoneFields?: JsonObject[];
    notesFields?: Element[];
    fieldMapping?: FieldMapping;
    configs?: MatchingConfigs;
  };
  const local: LocalMember = {
    kintoneFields: undefined,
    notesFields: undefined,
    fieldMapping: undefined,
    configs: undefined,
  };

  const model = reactive({
    tables: ref(),
  });

  const handleEmitUpdateFieldsOnKintone = (data: {
    fields: [];
    configs: MatchingConfigs;
  }) => {
    local.kintoneFields = data.fields;
    local.configs = data.configs;
  };

  const handleEmitUpdateFieldsOnNotes = (data: { fields: [] }) => {
    local.notesFields = data.fields;
  };

  const doClickMapping = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (local.kintoneFields && local.notesFields) {
      const mapping = fieldMapping(local.kintoneFields, local.notesFields, {
        configs: local.configs || MATCHING_CONFIG_TYPES,
      });

      const result = mapping.result;
      const tables = {
        ths: mapping.labels,
        trs: result.map((fieldInfo) => {
          return { tds: fieldInfo.toArray() };
        }),
      };

      local.fieldMapping = mapping;
      model.tables = tables;
    }
  };

  const doClickCopy = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (local.fieldMapping) {
      //const mapping = fieldMapping(local.kintone, local.notes);
      const mapping = local.fieldMapping;

      navigator.clipboard.writeText(mapping.toString());
    }
  };

  return {
    //local,
    model,
    handleEmitUpdateFieldsOnKintone,
    handleEmitUpdateFieldsOnNotes,
    doClickMapping,
    doClickCopy,
  };
};

export default defineComponent({
  name: "p-home",

  components: { OKintoneInfoVue, ONotesInfoVue, OTableVue },

  setup,
});
</script>
<template src="./PHome.html"></template>
