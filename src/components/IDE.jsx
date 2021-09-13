import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/keymap/sublime';

import 'codemirror/addon/selection/active-line';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/comment/comment.js';

import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/go/go';

import { Controlled as ControlledEditor } from 'react-codemirror2';

const IDE = (props) => {
  const { language, value, onChange } = props.options;

  function handleChange(editor, data, value) {
    onChange(value);
  }

  return (
    <ControlledEditor
      onBeforeChange={handleChange}
      value={value}
      className="code-mirror-wrapper"
      options={{
        lineWrapping: true,
        mode: language,
        theme: 'material',
        keyMap: 'sublime',
        lineNumbers: true,
        styleActiveLine: { nonEmpty: true },
        matchBrackets: true,
        matchTags: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        indentWithTabs: true,
        tabSize: 2,
      }}
    />
  );
};

export default IDE;
