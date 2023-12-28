<script lang="ts">
import { defineComponent } from "vue";
import type { ComponentOptions } from "vue";

const props: ComponentOptions["props"] = {
  table: {
    type: Object,
    default: () => {
      return { ths: [], trs: [{ tds: [] }] };
    },
  },
};

export default defineComponent({
  name: "o-table",
  props,
});
</script>

<template src="./OTable.html"></template>
