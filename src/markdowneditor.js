/* global DO */

var EasyMDE = require('easymde')
var TurndownService = require('turndown').default

module.exports = {
  EasyMDE: EasyMDE,
  markdownIdCounter: 0,
  markdownInstances: [],
  smartdownEnabled: false,
  enableSmartdown: function() {
    DO.U.MarkdownEditor.smartdownEnabled = true;
    DO.U.Editor.enableEditor(DO.C.User.Role)
  },

  toMarkdown: function (base) {
    var turndownService = new TurndownService()
    var markdownText = turndownService.turndown(base.selection)

    DO.U.MarkdownEditor.markdownIdCounter++;
    var preId = `easymde-solid-pre-${DO.U.MarkdownEditor.markdownIdCounter}`;

    var markdownElementSource =
`
<pre
id="${preId}"
class="markdown-content">${markdownText}</pre>
`;
    MediumEditor.util.insertHTMLCommand(base.selectedDocument, markdownElementSource);
    base.restoreSelection();
    base.checkSelection();
    var markdownElement = document.getElementById(preId);
    DO.U.MarkdownEditor.buildMarkdownEditorFromElement(markdownElement, 'author');
  },

  unmarkdown: function(editor){
    editor.toTextArea();
    editor.sourceElement.classList.remove('markdown-content');
    editor.element.parentElement.remove();
  },

  buildMarkdownEditors: function(editorMode) {
    DO.U.MarkdownEditor.markdownInstances.forEach((m) => {
      m.toTextArea();
    });
    var oldEditors = document.getElementsByClassName("easymde-div");
    var oldEditorsCopy = [];
    Array.prototype.forEach.call(oldEditors, function(e) {
      oldEditorsCopy.push(e);
    });

    oldEditorsCopy.forEach((e) => {
      e.remove();
    });
    DO.U.MarkdownEditor.markdownInstances = [];

    var sourceElements = document.querySelectorAll(".markdown-content");
    sourceElements.forEach((sourceElement) => {
      DO.U.MarkdownEditor.buildMarkdownEditorFromElement(sourceElement, editorMode);
    });
  },

  buildMarkdownEditorFromElement: function(sourceElement, editorMode) {
    DO.U.MarkdownEditor.markdownIdCounter++;
    var preloadValue = sourceElement.textContent;
    var textareaId = `easymde-solid-textarea-${DO.U.MarkdownEditor.markdownIdCounter}`;
    var textareaDivSource =
  `
<div
class="easymde-div"
contenteditable="false"
data-disable-editing="true">
<textarea
id="${textareaId}">
</textarea>
</div>
  `;
    sourceElement.insertAdjacentHTML('afterend', textareaDivSource);
    var textarea = document.getElementById(textareaId);
    var easyMDEInstance = new DO.U.MarkdownEditor.EasyMDE({
      // autofocus: true,
      // autosave: {
      //   enabled: true,
      //   uniqueId: 'MyUniqueID',
      //   delay: 1000,
      // },
      // blockStyles: {
      //   bold: '__',
      //   italic: '_',
      // },
      element: textarea,
      forceSync: false,
      // hideIcons: ['guide', 'heading'],
      // indentWithTabs: false,
      initialValue: preloadValue,
      // insertTexts: {
      //   horizontalRule: ['', '\n\n-----\n\n'],
      //   image: ['![](http://', ')'],
      //   link: ['[', '](http://)'],
      //   table: ['', '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'],
      // },
      // lineWrapping: false,
      minHeight: '100px',
      // parsingConfig: {
      //   allowAtxHeaderWithoutSpace: true,
      //   strikethrough: false,
      //   underscoresBreakWords: true,
      // },
      // placeholder: 'Type here...',
      previewClass: ['editor-preview', 'easymde-preview'],
      // previewClass: ['my-custom-styling', 'more-custom-styling'],
      // previewRender: function(plainText) {
      //   return customMarkdownParser(plainText); // Returns HTML from a custom parser
      // },
      previewRender: function(plainText, preview) { // Async method
        if (!DO.U.MarkdownEditor.smartdownEnabled) {
          return DO.U.MarkdownEditor.EasyMDE.prototype.markdown(plainText);
        }

        if (preview.innerHTML === '') {
          DO.U.MarkdownEditor.markdownIdCounter++;
          var sdPreviewId = `smartdown-preview-${DO.U.MarkdownEditor.markdownIdCounter}`;
          var sdId = `smartdown-output-${DO.U.MarkdownEditor.markdownIdCounter}`;
          var sdDiv =
`
<div
id="${sdPreviewId}"
class="smartdown-outer-container smartdown-theme-blog">
<div
id="${sdId}"
class="smartdown-container">
</div>
</div>
`;
          setTimeout(function() {
            var smartdownDiv = document.getElementById(sdId);
            preview.smartdownDiv = smartdownDiv;
            smartdown.setSmartdown(plainText, smartdownDiv, function() {
              smartdown.startAutoplay(preview.smartdownDiv);
            });
          }, 0);

          return sdDiv;
        }
        else if (preview.smartdownDiv) {
          smartdown.setSmartdown(plainText, preview.smartdownDiv, function() {
            smartdown.startAutoplay(preview.smartdownDiv);
          });

          return null;
        }
        else {
          return null;
        }
      },
      // promptURLs: true,
      // promptTexts: {
      //   image: 'Custom prompt for URL:',
      //   link: 'Custom prompt for URL:',
      // },
      // renderingConfig: {
      //   singleLineBreaks: false,
      //   codeSyntaxHighlighting: true,
      // },
      // shortcuts: {
      //   drawTable: 'Cmd-Alt-T'
      // },
      // showIcons: ['code', 'table'],
      // spellChecker: false,
      status: false,
      // status: ['autosave', 'lines', 'words', 'cursor'], // Optional usage
      // status: ['autosave', 'lines', 'words', 'cursor', {
      //   className: 'keystrokes',
      //   defaultValue: function(el) {
      //     this.keystrokes = 0;
      //     el.innerHTML = '0 Keystrokes';
      //   },
      //   onUpdate: function(el) {
      //     el.innerHTML = ++this.keystrokes + ' Keystrokes';
      //   },
      // }], // Another optional usage, with a custom status bar item that counts keystrokes
      // styleSelectedText: false,
      syncSideBySidePreviewScroll: false,
      toolbar: [
        {
          name: 'bold',
          action: EasyMDE.toggleBold,
          className: 'fa fa-bold',
          title: 'Bold',
          default: true,
        },
        {
          name: 'italic',
          action: EasyMDE.toggleItalic,
          className: 'fa fa-italic',
          title: 'Italic',
          default: true,
        },
        {
          name: 'strikethrough',
          action: EasyMDE.toggleStrikethrough,
          className: 'fa fa-strikethrough',
          title: 'Strikethrough',
        },
        // {
        //     name: 'heading',
        //     action: EasyMDE.toggleHeadingSmaller,
        //     className: 'fa fa-header fa-heading',
        //     title: 'Heading',
        //     default: true,
        // },
        // {
        //     name: 'heading-smaller',
        //     action: EasyMDE.toggleHeadingSmaller,
        //     className: 'fa fa-header fa-heading header-smaller',
        //     title: 'Smaller Heading',
        // },
        // {
        //     name: 'heading-bigger',
        //     action: EasyMDE.toggleHeadingBigger,
        //     className: 'fa fa-header fa-heading header-bigger',
        //     title: 'Bigger Heading',
        // },
        // {
        //     name: 'heading-1',
        //     action: EasyMDE.toggleHeading1,
        //     className: 'fa fa-header fa-heading header-1',
        //     title: 'Big Heading',
        // },
        // {
        //     name: 'heading-2',
        //     action: EasyMDE.toggleHeading2,
        //     className: 'fa fa-header fa-heading header-2',
        //     title: 'Medium Heading',
        // },
        // {
        //     name: 'heading-3',
        //     action: EasyMDE.toggleHeading3,
        //     className: 'fa fa-header fa-heading header-3',
        //     title: 'Small Heading',
        // },
        "|",
        {
          name: 'code',
          action: EasyMDE.toggleCodeBlock,
          className: 'fa fa-code',
          title: 'Code',
        },
        {
          name: 'quote',
          action: EasyMDE.toggleBlockquote,
          className: 'fa fa-quote-left',
          title: 'Quote',
          default: true,
        },
        {
          name: 'unordered-list',
          action: EasyMDE.toggleUnorderedList,
          className: 'fa fa-list-ul',
          title: 'Generic List',
          default: true,
        },
        {
          name: 'ordered-list',
          action: EasyMDE.toggleOrderedList,
          className: 'fa fa-list-ol',
          title: 'Numbered List',
          default: true,
        },
        // {
        //     name: 'clean-block',
        //     action: EasyMDE.cleanBlock,
        //     className: 'fa fa-eraser',
        //     title: 'Clean block',
        // },
        "|",
        {
          name: 'link',
          action: EasyMDE.drawLink,
          className: 'fa fa-link',
          title: 'Create Link',
          default: true,
        },
        {
          name: 'image',
          action: EasyMDE.drawImage,
          className: 'fa fa-image',
          title: 'Insert Image',
          default: true,
        },
        // {
        //     name: 'upload-image',
        //     action: EasyMDE.drawUploadedImage,
        //     className: 'fa fa-image',
        //     title: 'Import an image',
        // },
        // {
        //     name: 'table',
        //     action: EasyMDE.drawTable,
        //     className: 'fa fa-table',
        //     title: 'Insert Table',
        // },
        {
          name: 'horizontal-rule',
          action: EasyMDE.drawHorizontalRule,
          className: 'fa fa-minus',
          title: 'Insert Horizontal Line',
        },
        "|",
        {
          name: 'preview',
          action: EasyMDE.togglePreview,
          className: 'fa fa-eye',
          noDisable: true,
          title: 'Toggle Preview',
          default: true,
        },
        {
          name: 'side-by-side',
          action: EasyMDE.toggleSideBySide,
          className: 'fa fa-columns',
          noDisable: true,
          noMobile: true,
          title: 'Toggle Side by Side',
          default: true,
        },
        {
          name: 'fullscreen',
          action: EasyMDE.toggleFullScreen,
          className: 'fa fa-arrows-alt',
          noDisable: true,
          noMobile: true,
          title: 'Toggle Fullscreen',
          default: true,
        },
        "|",
        {
          name: 'guide',
          action: 'https://www.markdownguide.org/basic-syntax/',
          className: 'fa fa-question-circle',
          noDisable: true,
          title: 'Markdown Guide',
          default: true,
        },
        "|",
        {
          name: 'undo',
          action: EasyMDE.undo,
          className: 'fa fa-undo',
          noDisable: true,
          title: 'Undo',
        },
        {
          name: 'redo',
          action: EasyMDE.redo,
          className: 'fa fa-repeat fa-redo',
          noDisable: true,
          title: 'Redo',
        },
        {
          name: 'unmarkdown',
          action: DO.U.MarkdownEditor.unmarkdown,
          className: 'fa fa-eject',
          // noDisable: true,
          title: 'UnMarkdown',
        },
      ],
      // tabSize: 4,
      // toolbar: editorMode === 'author',
      // toolbarTips: true,
    });

    easyMDEInstance.sourceElement = sourceElement;
    DO.U.MarkdownEditor.markdownInstances.push(easyMDEInstance);
    if (editorMode !== 'author') {
      easyMDEInstance.toolbarElements.preview.onclick(document.createEvent('Event'));
      easyMDEInstance.gui.toolbar.style.display = 'none';
    }

    easyMDEInstance.codemirror.on("change", function() {
      const latest = easyMDEInstance.value();
      sourceElement.textContent = latest;
    });

    window.easyMDEInstance = easyMDEInstance;
    // console.log('easyMDEInstance', textareaId);
    // console.log(easyMDEInstance);
    // console.log(textareaDivSource);
  },
};
