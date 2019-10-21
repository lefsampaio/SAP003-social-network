const actionButton = (props) => {
  const template = `
      <button type= ${props.type} class="${props.class}" name=${props.name} data-docid=${props.dataDocid}
      onclick="button.handleClick(event,${props.onClick})">${props.title}</button>`;

  return template;
};

window.button = {
  handleClick: (event, callBack) => {
    // event.preventDefault();
    callBack(event.target);
  },
};

export default actionButton;
