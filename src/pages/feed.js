import Button from '../components/button.js';
import udButton from '../components/udButton.js';
import textArea from '../components/text-area.js';

const logout = () => {
  app.auth.signOut().catch((error) => {
    // console.log(error);
  });
};

const deletePost = (target) => {
  const confirmDelete = confirm('Deseja mesmo deletar?');
  if (confirmDelete) {
    app.db.collection('posts').doc(target.dataset.docid).delete().then(() => {
      target.parentElement.parentElement.remove();
    });
  }
};


const makePostEditable = (target) => {
  target.parentElement.style.display = 'none';
  target.parentElement.previousElementSibling.style.display = 'inline';
  target.parentElement.parentElement.previousElementSibling.contentEditable = true;
  target.parentElement.parentElement.previousElementSibling.className += ' editable-text';
};

const saveEditPost = (target) => {
  target.parentElement.style.display = 'none';
  target.parentElement.nextElementSibling.style.display = 'inline';
  const pText = target.parentElement.parentElement.previousElementSibling;
  const id = target.parentElement.dataset.docid;
  const db = firebase.firestore();
  pText.contentEditable = false;
  pText.className = 'text';
  db.collection('posts').doc(id).update({
    text: pText.textContent,
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  });
};

const checkUserEdit = (doc) => {
  const user = app.auth.currentUser.uid;
  if (user === doc.user) {
    return `
    ${udButton({
    type: 'button',
    class: 'save-btn minibtns edit-save-btns',
    name: doc.user,
    dataDocid: doc.id,
    onClick: saveEditPost,
    title: '️️️️️️<i class="fas fa-check"></i>',
  })}
      ${udButton({
    type: 'button',
    class: 'edit-btn minibtns edit-save-btns',
    name: doc.user,
    dataDocid: doc.id,
    onClick: makePostEditable,
    title: '<i class="fas fa-pencil-alt"></i>',
  })}
    `;
  }
  return '';
};

const checkUserDelete = (doc) => {
  const user = app.auth.currentUser.uid;
  if (user === doc.user) {
    return `
  ${udButton({
    type: 'button',
    class: 'delete-btn minibtns',
    name: doc.user,
    dataDocid: doc.id,
    onClick: deletePost,
    title: 'X',
  })}`;
  }
  return '';
};

const postTemplate = doc => `
    <div class='posted container-post' data-id=${doc.id}> 
      <p class='posted posted-name'> Publicado por ${doc.name} | ${doc.date}
      ${checkUserDelete(doc)}
      </p>
      <div class='text-button'>
      <p class='text' data-docid=${doc.id}> ${doc.text}</p>
      <div class='buttons'>
      ${checkUserEdit(doc)}
      </div>
      </div>
    </div>`;

const newPost = () => {
  const textArea = document.querySelector('.add-post');
  const post = {
    name: app.auth.currentUser.displayName,
    user: app.auth.currentUser.uid,
    text: textArea.value,
    timestamp: new Date().getTime(),
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  };
  app.db.collection('posts').add(post).then((docRef) => {
    const docPost = {
      ...post,
      id: docRef.id,
    };

    document.querySelector('.posts').insertAdjacentHTML('afterbegin', app.postTemplate(docPost));

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
  let postsTemplate = '';
  props.posts.forEach((post) => {
    const docPost = {
      ...post.data(),
      id: post.id,
    };
    postsTemplate += postTemplate(docPost);
  });

  const template = `
  ${Button({
    type: 'button',
    title: 'Sair',
    class: 'primary-button signout-button',
    onClick: logout,
    disabled: 'enabled',
  })}
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
