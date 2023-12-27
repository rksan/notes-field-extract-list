const readAsText = (file: Blob, encode: string): Promise<FileReader> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener("load", () => resolve(reader));
    reader.addEventListener("error", () => reject(reader));
    reader.readAsText(file, encode);
  });
};

export default readAsText;
