export const getDatabase = (xml: XMLDocument) => {
  return xml.querySelector("database");
};

export const getForms = (
  xml: XMLDocument,
  options?: { default?: boolean; subform?: boolean }
): Node[] => {
  let nodes: NodeList;

  if (options?.default) {
    nodes = xml.querySelectorAll("note[class=form][default=true]");
  } else {
    nodes = xml.querySelectorAll("note[class=form]");
  }

  if (nodes.length === 0) {
    nodes = xml.querySelectorAll("form");
    return Array.from(nodes);
  } else {
    //console.log("notes=", nodes);
    const forms = Array.from(nodes).filter((node) => {
      const elem = node as Element;

      const body =
        elem.querySelector("item[name=\\$BODY]") ||
        elem.querySelector("item[name=\\$Body]");

      let result = true;

      if (body) {
        // is form
        const flag =
          elem.querySelector("item[name=\\$FLAGS]") ||
          elem.querySelector("item[name=\\$Flags]");

        const cdata = flag?.textContent;

        // check subform
        const isSubform = !cdata
          ? false
          : cdata.includes("C") &&
            cdata.includes("U") &&
            cdata.includes("3") &&
            cdata.includes("x");

        if (options?.subform) {
          // Extract subform
          result = isSubform;
        } else {
          // Extract form
          result = !isSubform;
        }
      } else {
        // not form
        result = false;
      }

      return result;
    });

    return forms;
  }
};

export const getFormNames = (form: Element): string[] => {
  const formNames: Array<string> = [];

  if (form.tagName === "note") {
    const elem = form.querySelector("item[name=\\$TITLE]");

    if (elem) {
      const title = elem as Element;

      const textlist = title.querySelector("textlist");

      if (textlist) {
        const list = textlist.querySelectorAll("text");

        if (list) {
          const names: string[] = [];

          list.forEach((text) => {
            if (text.textContent) {
              names.push(text.textContent);
            }
          });

          formNames.push(names.join("|"));
        }
      } else {
        const text = title.querySelector("text");

        if (text) {
          if (text.textContent) {
            formNames.push(text.textContent);
          }
        }
      }
    }
  } else if (form.tagName === "form") {
    formNames.push(form.getAttribute("name") || "");
  }

  return formNames;
};

export const getAllFormNames = (forms: NodeList | Node[]): string[] => {
  let formNames: Array<string> = [];

  forms.forEach((node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const form = node as Element;
      formNames = formNames.concat(getFormNames(form));
    }
  });

  return formNames;
};

export const getForm = (
  forms: NodeList | Node[],
  formName: string
): Element | null => {
  let result: Element | null = null;

  forms.forEach((node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const form = node as Element;
      const names = getFormNames(form);

      if (names.includes(formName)) {
        result = form;
        return false;
      }
    }
  });

  return result;
};

export const getFields = (form: Element): Element[] => {
  const nodes = form.querySelectorAll("field");

  return Array.from(nodes).map((node) => {
    return node as Element;
  });
};

export const getFieldInfo = (field: Element) => {
  let info = "";
  if (field.getAttribute("allowmultivalues") === "true") {
    info =
      field.getAttribute("name") +
      "\t" +
      field.getAttribute("type") +
      "list" +
      "\n";
  } else {
    info =
      field.getAttribute("name") + "\t" + field.getAttribute("type") + "\n";
  }
  return info;
};
