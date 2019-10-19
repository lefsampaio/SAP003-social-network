const divPosts = (props) => {
  const template = `
        <div class=${props.class} onclick="divPosts.handleClick(event,${props.onClick})">${props.content}</div>`;

  return template;
};

window.divPosts = {
  handleClick: (event, callBack) => {
    callBack(event.target);
  },
};

export default divPosts;
