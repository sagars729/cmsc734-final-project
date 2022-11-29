import React, { useState, useMemo  } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



const EditorConvertToHTML = (props :any) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const handleChange = (data:any) => {
      setEditorState(data);
      let newData = [...props.data];
        newData[props.idx].points[props.pointIdx].analysis_yielded = convertToRaw(editorState.getCurrentContent());
        props.setData(newData);
        // point.analysis_yielded = e.target.value;
    };
    var htmlData = useMemo(
      () => draftToHtml(convertToRaw(editorState.getCurrentContent())),
      [editorState]
    );
  
    const toolbarOptions = {
      options: ["inline", "fontSize", "image", "emoji"],
      inline: {
        options: ["bold", "italic", "underline", "strikethrough"],
      },
    };
  
    return (
      <div className="app">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleChange}
          wrapperClassName="editor-wrapper"
          editorClassName="message-editor"
          toolbarClassName="message-toolbar"
          toolbar={toolbarOptions}
        />
        <div className="html-output">{htmlData}</div>
      </div>
    )
}


export default EditorConvertToHTML;