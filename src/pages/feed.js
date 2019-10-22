import Button from '../components/button.js';
import textArea from '../components/text-area.js';
import actionIcon from '../components/action-icon.js';

const logout = () => {
  app.auth.signOut().catch((error) => {
    // console.log(error);
  });
};

const deletePost = (deleteButton) => {
  const confirmDelete = confirm('Deseja mesmo deletar?');
  if (confirmDelete) {
    app.db.collection('posts').doc(deleteButton.dataset.docid).delete().then(() => {
      deleteButton.parentElement.parentElement.remove();
    });
  }
};


const makePostEditable = (pencilIcon) => {
  pencilIcon.className = 'edit-btn minibtns hide';
  pencilIcon.previousElementSibling.className = 'save-btn minibtns show fas fa-check';
  pencilIcon.parentElement.previousElementSibling.contentEditable = true;
  pencilIcon.parentElement.previousElementSibling.className += ' editable-text';
};

const saveEditPost = (checkIcon) => {
  checkIcon.className = 'save-btn minibtns hide fas fa-check';
  checkIcon.nextElementSibling.className = 'edit-btn minibtns show';
  const pText = checkIcon.parentElement.previousElementSibling;
  const id = checkIcon.dataset.docid;
  const db = firebase.firestore();
  pText.contentEditable = false;
  pText.className = 'text';
  db.collection('posts').doc(id).update({
    text: pText.textContent,
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  });
};

const like = (heart) => {
  const newlike = Number(heart.nextElementSibling.textContent) + 1;
  app.db.collection('posts').doc(heart.dataset.docid)
    .update({
      likes: newlike,
    });
};

const checkUserEdit = (doc) => {
  const user = app.auth.currentUser.uid;
  if (user === doc.user) {
    return `
    ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name: doc.user,
    dataDocid: doc.id,
    onClick: saveEditPost,
  })}
      ${actionIcon({
    class: 'edit-btn minibtns fas fa-pencil-alt',
    name: doc.user,
    dataDocid: doc.id,
    onClick: makePostEditable,
  })}
    `;
  }
  return '';
};

const checkUserDelete = (doc) => {
  const user = app.auth.currentUser.uid;
  if (user === doc.user) {
    return `
  ${actionIcon({
    class: 'delete-btn minibtns fas fa-times',
    name: doc.user,
    dataDocid: doc.id,
    onClick: deletePost,
  })}`;
  }
  return '';
};

const addComment = (commentIcon) => {
  commentIcon.parentElement.nextElementSibling.className = 'add-comment show';
  commentIcon.nextElementSibling.className = 'save-btn minibtns hide fas fa-check show';
};

const newComment = (checkIcon) => {
  const newComment = document.querySelector('.add-comment').value;
  app.db.collection(`posts/${checkIcon.dataset.docid}/comments`).add({ text: newComment, name: app.auth.currentUser.displayName });
};

const postTemplate = doc => `
    <div class='posted container-post' data-id=${doc.id}> 
      <p class='posted posted-name'> Publicado por ${doc.name} | ${doc.date}
      ${checkUserDelete(doc)}
      </p>
      <div class='text-button'>
        <p class='text' data-like=${doc.likes} data-docid=${doc.id} data-comments=${doc.comments}> ${doc.text}</p>
        <div class='buttons'>
        ${checkUserEdit(doc)}
        </div>
      </div>
      <div class="comments">
      <div>
      ${actionIcon({
    class: 'comment-btn minibtns fab far fa-paper-plane',
    name: doc.user,
    dataDocid: doc.id,
    onClick: addComment,
  })}
    ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name: doc.name,
    dataDocid: doc.id,
    onClick: newComment,
  })}
      ${actionIcon({
    class: 'like-btn minibtns fas fa-heart',
    name: doc.user,
    dataDocid: doc.id,
    onClick: like,
  })}
      <span class="likes">${doc.likes}</span>
      </div>
      ${textArea({
    class: 'add-comment hide',
    placeholder: 'Comente...',
    // onKeyup:
  })}
      </div>
    </div>`;


const newPost = () => {
  const textArea = document.querySelector('.add-post');
  const post = {
    name: app.auth.currentUser.displayName,
    user: app.auth.currentUser.uid,
    text: textArea.value,
    likes: 0,
    timestamp: new Date().getTime(),
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  };
  app.db.collection('posts').add(post).then((docRef) => {
    docRef = {
      ...post,
      id: docRef.id,
    };

    textArea.value = '';
    document.querySelector('.post-btn').disabled = true;
  });
};

const buttonActivate = (e) => {
  const postBtn = e.target.nextSibling.nextSibling;
  const chars = e.target.value.length;
  if (chars !== 0) {
    postBtn.disabled = false;
  } else {
    postBtn.disabled = true;
  }
};

const Feed = (props) => {
  console.log('entrou', props.posts);

  const postsTemplate = '';
  // const teste = props.posts.map(post => post);
  // console.log('TCL: Feed -> teste', teste);
  props.posts.forEach((post) => {
    console.log(post);
    // const docPost = {
    //   ...post.data(),
    //   id: post.id,
    // };
    // postsTemplate += postTemplate(docPost);
  });

  const template = `
  <header class='header'> <span class='header-title'> MusicalSpace </span>
  ${Button({
    type: 'button',
    title: 'Sair',
    class: 'primary-button signout-button',
    onClick: logout,
    disabled: 'enabled',
  })}</header>
    <section class="container screen-margin-bottom">
      <section class="container margin-top-container">
      <div class='new-post'>
      ${textArea({
    class: 'add-post',
    placeholder: 'O que você está ouvindo?',
    onKeyup: buttonActivate,
  })}
        ${Button({
    type: 'button',
    title: 'Postar',
    class: 'primary-button post-btn',
    onClick: newPost,
    disabled: 'disabled',
  })}
      </div>
        <div class="posts"> ${postsTemplate} </div>
      </section>
    </section>
  `;
  return template;
};

window.app = {
  postTemplate,
  db: firebase.firestore(),
  auth: firebase.auth(),
};

export default Feed;
