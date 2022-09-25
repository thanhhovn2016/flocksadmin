const readUploadFileAsUrl = (file) => {
    // const fileReader = new FileReader();
  
    // return new Promise((resolve, reject) => {
    //   fileReader.addEventListener("error", () => {
    //     fileReader.abort();
    //     reject(new DOMException(`Error occurred reading file: ${file.name}`));
    //   });
  
    //   fileReader.addEventListener("load", () => {
    //     resolve(fileReader.result);
    //   });
    //   if (typeof file !== "string") 
    //   fileReader?.readAsDataURL(file);
    // });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  };

  export {readUploadFileAsUrl}