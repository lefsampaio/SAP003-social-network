const actionButton = (props) => {
  const template = `
      <button type= ${props.type} class="${props.class}" name=${props.name} data-docid=${props.dataDocid}
      >${props.title}</button>`;

  return template;
};

// window.button = {
//   handleClick: (event, callBack) => {
//     // event.preventDefault();
//     callBack(event.target);
//   },
// };

export default actionButton;
