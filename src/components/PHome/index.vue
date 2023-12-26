<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

const setup = () => {
  const local = reactive({
    xml: ref(),
    forms: ref(),
  });
  const model = reactive({
    formNames: ref(),
    txaValue: ref(""),
  });

  const doChangeFile = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.currentTarget) {
      const target = event.currentTarget as HTMLInputElement;

      if (target.files) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result) {
            const result = reader.result as string;
            //console.log("result=", result);
            const parser = new DOMParser();
            const xml = parser.parseFromString(
              result,
              "application/xml"
            ) as XMLDocument;

            xml.onload = () => {
              local.xml = xml;

              const forms = xml.querySelectorAll(
                "note[class=form]"
              ) as NodeList;

              local.forms = forms;

              //console.log("forms = ", forms);
              const formNames: Array<string> = [];

              forms.forEach((node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const form = node as Element;
                  const title = form.querySelector("item[name=\\$TITLE]");
                  //console.log("items", title);
                  const name = title?.textContent;
                  if (name) {
                    formNames.push(name);
                  }
                }
              });

              model.formNames = formNames.sort();
            };

            xml.dispatchEvent(new Event("load"));
          }
        };

        reader.readAsText(file);
      }
    }
  };

  const doChangeSelect = (event: Event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const select = event.currentTarget as HTMLSelectElement;

    const value = select.value;

    let txaValue = "";

    const forms = local.forms as NodeList;

    forms.forEach((node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const form = node as Element;
        const item = form.querySelector("item[name=\\$TITLE]");
        const name = item?.textContent;

        if (name === value) {
          const fields = form.querySelectorAll("field");

          console.log("fields=", fields);

          fields.forEach((node: Node) => {
            const field = node as Element;
            txaValue +=
              field.getAttribute("name") +
              "\t" +
              field.getAttribute("type") +
              "\n";
          });
          return false;
        }
      }
    });

    model.txaValue = txaValue;
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
    local,
    model,
    doChangeFile,
    doChangeSelect,
    doClickCopy,
  };
};

export default defineComponent({
  name: "PHome",
  setup,
});
</script>
<template src="./template.html"></template>
