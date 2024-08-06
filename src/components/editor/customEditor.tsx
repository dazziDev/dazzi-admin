"use client";
import {
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Base64UploadAdapter,
  BlockQuote,
  BlockToolbar,
  Bold,
  ClassicEditor,
  CloudServices,
  Code,
  CodeBlock,
  EditorConfig,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontFamilyEditing,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  HeadingEditing,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
} from "ckeditor5";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import translations from "ckeditor5/translations/ko.js";
import { useEffect, useRef, useState } from "react";

const CustomEditor = () => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  function handleEditorEvent(event: any, editor: any) {
    if (!event || !event.target) {
      console.warn("Event or target is undefined.");
      return;
    }
    console.log("Handling editor event:", event);
  }

  const editorConfig: EditorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertTable",
        "highlight",
        "blockQuote",
        "codeBlock",
        "|",
        "alignment",
        "|",
        "outdent",
        "indent",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "imageUpload",
        "htmlEmbed",
        "|",
        "findAndReplace",
        "selectAll",
        "|",
        "removeFormat",
        "|",
        "specialCharacters",
        "|",
        "subscript",
        "superscript",
        "|",
        "horizontalLine",
        "|",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      CloudServices,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FontFamilyEditing,
      GeneralHtmlSupport,
      Highlight,
      Heading,
      HeadingEditing,
      HorizontalLine,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Paragraph,
      RemoveFormat,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      Underline,
      Undo,
      Base64UploadAdapter,
    ],
    blockToolbar: [
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "insertTable",
      "|",
      "outdent",
      "indent",
    ],
    fontFamily: {
      supportAllValues: true,
      options: [
        "default",
        "맑은 고딕",
        "궁서체",
        "바탕",
        "돋움",
        "Rix이누아리두리네",
        "창원단감아삭체",
        "카페24 모야모야",
        "온글잎 언즈체",
        "HS산토끼체",
        "제주돌담체",
        "망고보드 또박체",
        "Arial, sans-serif",
        "Courier New, monospace",
        "Georgia, serif",
        "Lucida Sans Unicode, sans-serif",
        "Tahoma, sans-serif",
        "Times New Roman, serif",
        "Trebuchet MS, sans-serif",
        "Verdana, sans-serif",
      ],
    },
    // FontFamilyEditing: {
    //   supportAllValues: true,
    // },
    fontSize: {
      options: [
        10,
        12,
        14,
        "default",
        18,
        20,
        22,
        24,
        26,
        28,
        30,
        32,
        36,
        40,
        48,
        56,
        64,
      ],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },

    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage",
      ],
    },
    simpleUpload: {
      uploadUrl: "data:image/png;base64,",
    },
    initialData: "",
    language: "ko",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
        isExternal: {
          mode: "automatic",
          callback: (url: string | null) => {
            return url!.startsWith("http://") || url!.startsWith("https://");
          },
          attributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: "기사입력",
    style: {
      definitions: [
        {
          name: "Article category",
          element: "h3",
          classes: ["category"],
        },
        {
          name: "Title",
          element: "h2",
          classes: ["document-title"],
        },
        {
          name: "Subtitle",
          element: "h3",
          classes: ["document-subtitle"],
        },
        {
          name: "Info box",
          element: "p",
          classes: ["info-box"],
        },
        {
          name: "Side quote",
          element: "blockquote",
          classes: ["side-quote"],
        },
        {
          name: "Marker",
          element: "span",
          classes: ["marker"],
        },
        {
          name: "Spoiler",
          element: "span",
          classes: ["spoiler"],
        },
        {
          name: "Code (dark)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-dark"],
        },
        {
          name: "Code (bright)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-bright"],
        },
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    translations: [translations],
  };
  return (
    <div>
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  onChange={handleEditorEvent}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEditor;
