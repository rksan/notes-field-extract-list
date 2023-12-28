<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { ComponentOptions } from "vue";

import {} from "@/lib/matchingConfig";

const setup: ComponentOptions["setup"] = () => {
  const model = reactive({
    configs: ref(),
  });

  return {
    model,
  };
};

export default defineComponent({
  name: "p-setting",
  setup,
});
</script>
<template src="./Psetting.html"></template>
