import React, { useEffect, useRef, useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import SunEditorCore from "suneditor/src/lib/core";
import Suneditor from "suneditor";
// import plugins from 'suneditor/src/plugins'
// import suneditor from 'suneditor'

// import dynamic from "next/dynamic";

// const SunEditor = dynamic(() => import("suneditor-react"), {
//     ssr: false,
//   });

interface IProps {
  contentWithHtmlFunction: (data: string, text: string) => void;
  defaultValue?:string | undefined
}
const TextEditor = (props: IProps) => {
  const editor = useRef<SunEditorCore>();
  let content: SunEditorCore;
  // const [changeState , setChangeState ] = useState(true)
   const handleImageUploadEditor = (event: any) => {

    
  };
// useEffect(() => {
// setChangeState(false)
// },[props?.defaultValue])

  function handleImageUploadBefore (file: any, info: object , uploadHandler:Function) {
    
    // content.appendContents('<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FCommons%3AQuality_images&psig=AOvVaw0AhAR9FfSfFhTlLeLn2Rxw&ust=1650446923051000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCKjqtozon_cCFQAAAAAdAAAAABAT"/>')
    // 
    content.setContents('<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FCommons%3AQuality_images&psig=AOvVaw0AhAR9FfSfFhTlLeLn2Rxw&ust=1650446923051000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCKjqtozon_cCFQAAAAAdAAAAABAT"/>')
    return true
  };
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
    content = editor.current;
  };
  const handleChangeEditor = (event: string) => {
    const contentText = content.getText();
    props?.contentWithHtmlFunction(event, contentText);
  };
  return (
    <div>
      <SunEditor
        defaultValue={props.defaultValue}
        // onImageUploadBefore={handleImageUploadBefore}
        height="10rem"
        onImageUpload={handleImageUploadEditor}
        setDefaultStyle="font-family: cursive; font-size: 10px;"
        getSunEditorInstance={getSunEditorInstance}
        onChange={handleChangeEditor}
        setAllPlugins={true}
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            "/", // Line break
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
            ["imageGallery"], // You must add the "imageGalleryUrl".
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["save", "template"],

            /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
          ],
        }}
      />
    </div>
  );
};

export default TextEditor;
