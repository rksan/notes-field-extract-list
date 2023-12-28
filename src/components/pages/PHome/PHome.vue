<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import {
  OKintoneInfoVue,
  ONotesInfoVue,
  OTableVue,
} from "@/components/organisms";
import { fieldMapping } from "@/lib/mapping";

const setup = () => {
  const local = reactive({
    kintone: ref(),
    notes: ref(),
    mapping: ref(),
  });

  const model = reactive({
    tables: ref(),
  });

  const handleEmitUpdateFieldsOnKintone = (data: { fields: [] }) => {
    local.kintone = data.fields;
  };

  const handleEmitUpdateFieldsOnNotes = (data: { fields: [] }) => {
    console.log("data=", data);
    local.notes = data.fields;
  };

  const doClickMapping = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (local.kintone && local.notes) {
      const mapping = fieldMapping(local.kintone, local.notes);

      const result = mapping.result;
      const tables = {
        ths: mapping.labels,
        trs: result.map((fieldInfo) => {
          return { tds: fieldInfo.toArray() };
        }),
      };

      local.mapping = mapping;
      model.tables = tables;
    }
  };

  const doClickCopy = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (local.mapping) {
      const mapping = local.mapping;

      navigator.clipboard.writeText(mapping.toString());
    }
  };

  return {
    local,
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
