const textArea = (props) => {
  const template = `
      <textarea class=${props.class} placeholder="${props.placeholder}" onkeyup="${props.onKeyup}"></textarea>`;

  return template;
};

// window.textarea = {
//   handleKeyup: (callBack) => {
//     callBack();
//   },
// };

export default textArea;
