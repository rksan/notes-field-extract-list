<script lang="ts">
import { ComponentOptions } from "vue";
import { defineComponent, reactive, ref } from "vue";
import readAsText from "@/lib/readAsText";
import {
  getDatabase,
  getForms,
  getFormNames,
  getAllFormNames,
  getForm,
  getFields,
  getFieldInfo,
} from "@/lib/dxl";

const emits: ComponentOptions["emits"] = ["update-fields"];

const setup: ComponentOptions["setup"] = ($props, { emit }) => {
  type LocalMember = {
    forms?: Node[];
    subforms?: Node[];
    fields?: Element[];
  };
  const local: LocalMember = {
    forms: undefined,
    subforms: undefined,
    fields: undefined,
  };

  const model = reactive({
    appName: ref(),
    formNameList: ref(),
    subFormNameList: ref(),
    formName: ref(),
    subFormNames: ref([]),
    txaValue: ref(""),
  });

  const doEmitUpdateFilles = () => {
    const fields = local.fields;
    return emit("update-fields", { fields });
  };

  const reset = () => {
    model.appName = "";
    model.formNameList = null;
    model.subFormNameList = null;
    model.formName = "";
    model.subFormNames = [];
    model.txaValue = "";
  };

  const doChangeFile = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!event.currentTarget) return;

    const target = event.currentTarget as HTMLInputElement;

    if (!target.files) {
      reset();
      return;
    }

    const file = target.files[0];

    if (!(file instanceof Blob)) {
      reset();
      return;
    }

    readAsText(file, "UTF-8").then((reader) => {
      const result = reader.result as string;

      const parser = new DOMParser();
      const xml = parser.parseFromString(
        result,
        "application/xml"
      ) as XMLDocument;

      const database = getDatabase(xml);

      const forms = getForms(xml);
      const subforms = getForms(xml, { subform: true });
      const formNames = getAllFormNames(forms);
      const subFormNames = getAllFormNames(subforms);
      const defaultForm = getForms(xml, { default: true });
      const defaultFormName =
        defaultForm.length === 0
          ? [""]
          : getFormNames(defaultForm[0] as Element);

      //local.xml = xml;
      local.forms = forms;
      local.subforms = subforms;
      model.appName = database?.getAttribute("title");
      model.formNameList = formNames.sort();
      model.subFormNameList = subFormNames.sort();
      model.formName = defaultFormName[0];
      model.subFormNames = [];

      const form = getForm(forms, defaultFormName[0]);
      let fields = undefined;
      let txaValue = "";

      if (form) {
        fields = getFields(form);

        fields.forEach((node: Node) => {
          const field = node as Element;
          txaValue += getFieldInfo(field);
        });
      }

      local.fields = fields;
      model.txaValue = txaValue;

      doEmitUpdateFilles();
    });
  };

  const doChangeSelect = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const formName = model.formName;
    const subFormNames = model.subFormNames;

    const forms = local.forms;
    if (!forms) return;

    const form = getForm(forms, formName);

    const subForms = (() => {
      let subforms: Element[] = [];

      subFormNames.forEach((name) => {
        const result = local.subforms ? getForm(local.subforms, name) : false;
        if (result) {
          subforms.push(result);
        }
      });

      return subforms;
    })();

    let fields: Element[] = [];
    let txaValue = "";

    if (form) {
      fields = getFields(form);

      fields.forEach((field) => {
        txaValue += getFieldInfo(field);
      });

      subForms.forEach((subform) => {
        fields = fields.concat(getFields(subform));
        fields.forEach((node: Node) => {
          const field = node as Element;
          txaValue += getFieldInfo(field);
        });
      });
    }

    local.fields = fields;
    model.txaValue = txaValue;

    doEmitUpdateFilles();
  };

  const doClickCopy = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const elem = document.getElementById("txa");

    if (elem) {
      const txa = elem as HTMLTextAreaElement;
      txa.select();
      navigator.clipboard.writeText(txa.value);
    }
  };
  return {
    //local,
    model,
    doChangeFile,
    doChangeSelect,
    doClickCopy,
  };
};

export default defineComponent({
  name: "o-notes-info",
  emits,
  setup,
});
</script>

<template src="./ONotesInfo.html"></template>
