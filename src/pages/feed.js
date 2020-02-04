/* eslint-disable no-else-return */
import Button from '../components/button.js';
import textArea from '../components/text-area.js';
import actionIcon from '../components/action-icon.js';
import selectPrivacy from '../components/selectPrivacy.js';

const logout = (e) => {
  app.auth.signOut().catch((error) => {
    `<p>${error}</p>`
  });
};

const deletePost = (deleteButton) => {
  const id = deleteButton.dataset.docid;
  const confirmDelete = confirm('Deseja mesmo deletar?');
  if (confirmDelete) {
    app.db.collection('posts').doc(id).delete();
    document.querySelector('.posts').innerHTML = ''
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

const deleteComment = (commentDeleteIcon) => {
  const confirmDelete = confirm('Deseja mesmo deletar?');
  if (confirmDelete) {
    const post = commentDeleteIcon.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild;
    const postId = post.dataset.docid;
    const commentId = Number(commentDeleteIcon.dataset.docid);

    app.db.collection('posts').doc(postId).get().then((qs) => {
      const commentsPosts = qs.data().comments;
      const updatedComments = commentsPosts.filter(comment => comment.timestampComment !== commentId);

      app.db.collection('posts').doc(postId).update({
        commentsCount: firebase.firestore.FieldValue.increment(-1),
        comments: updatedComments,
      });
      document.querySelector('.posts').innerHTML = '';
    });
  }
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
  if (user === doc.user && doc.id) {
    return `
  ${actionIcon({
      class: 'delete-btn minibtns fas fa-times',
      name: doc.user,
      dataDocid: doc.id,
      onClick: deletePost,
    })}`;
  } else if (user === doc.user && doc.timestampComment) {
    return `
  ${actionIcon({
      class: 'delete-btn delete-btn-comment minibtns fas fa-times',
      name: doc.user,
      dataDocid: doc.timestampComment,
      onClick: deleteComment,
    })}`;
  }
  return '';
};

const addComment = (commentIcon) => {
  commentIcon.parentElement.nextElementSibling.classList.toggle('hide');
};

const saveComment = (event) => {
  if (event.keyCode === 13) {
    const comment = event.target.value;
    const id = event.target.parentElement.dataset.docid;

    app.db.collection('posts').doc(id).update({
      commentsCount: firebase.firestore.FieldValue.increment(1),
      comments: firebase.firestore.FieldValue.arrayUnion({
        comment,
        name: app.auth.currentUser.displayName,
        timestampComment: new Date().getTime(),
        user: app.auth.currentUser.uid,
        date: new Date().toLocaleString('pt-BR').slice(0, 16),
      }),
    })
    document.querySelector('.posts').innerHTML = '';
  }
};

const checkComments = (comments) => {
  if (comments && comments.length !== 0) {
    const commentsTemplate = [];
    comments.forEach((obj) => {
      commentsTemplate.push(`<div class="text comment-area">
      <p class='comment row'><span class="comment-name">${obj.name} | ${obj.date}</span>
      ${checkUserDelete(obj)}
      </p>
      <p class='comment'>${obj.comment}</p>
    </div>
  `);
    });
    const finalCommentsTemplate = `
    <div class="comments-title">
      <p class="branco">Comentários:</p>
      ${commentsTemplate.join('')}
    </div>`;
    return finalCommentsTemplate;
  }
  return '';
};

const postTemplate = doc => `
    <div class='column posted container-post' data-id=${doc.id}> 
      <p class='row posted posted-name'> Publicado por ${doc.name} | ${doc.date}
      ${checkUserDelete(doc)}
      </p>

    <div class='row text-button'>
      <p class='text' data-like=${doc.likes} data-docid=${doc.id}> ${doc.text}</p>
      <div class='buttons'>
      ${checkUserEdit(doc)}
      </div>
    </div>

     
      ${checkComments(doc.comments)}
      

      <div class='column comments' data-docid=${doc.id}>
        <div>
        ${actionIcon({
  class: 'comment-btn minibtns fab far fa-paper-plane',
  name: doc.user,
  dataDocid: doc.id,
  onClick: addComment,
})}
      <span class="likes">${doc.commentsCount}</span>
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
  onKeyup: saveComment,
})}

      </div>
    </div>`;


const newPost = () => {
  const textArea = document.querySelector('.add-post');
  const privacyOption = document.querySelector('.privacy-option');
  const post = {
    name: app.auth.currentUser.displayName,
    user: app.auth.currentUser.uid,
    text: textArea.value,
    likes: 0,
    commentsCount: 0,
    timestamp: new Date().getTime(),
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
    private: privacyOption.value,
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
  const postBtn = document.querySelector('.post-btn');
  const chars = e.target.value.length;
  if (chars !== 0) {
    postBtn.disabled = false;
  } else {
    postBtn.disabled = true;
  }
};

const Feed = (props) => {
  app.postsTemplate = '';
  document.querySelector('body').className = 'background';

  props.posts.forEach((post) => {
    const docPost = {
      ...post.data(),
      id: post.id,
    };
    app.postsTemplate += app.postTemplate(docPost);
  });

  const template = `
  <header class='header'> <h2 class='header-title'> MusicalSpace </h2>
  ${actionIcon({
    class: 'signout-icon fas fa-sign-out-alt',
    name: 'sair',
    dataDocid: 'a',
    onClick: logout,
  })}
  </header>
    <section class="container-main screen-margin-bottom">
      ${Profile()}
      <section class="container margin-top-container">
      <div class='column new-post'>
      ${textArea({
    class: 'add-post',
    placeholder: 'O que você está ouvindo?',
    onKeyup: buttonActivate,
  })}
  <div class='row'>
    ${selectPrivacy({
    class: 'privacy-option',
    onChange: changeViewPost,
    opClass1: 'public',
    value1: 'false',
    txt1: 'Público',
    opClass2: 'private',
    value2: 'true',
    txt2: 'Privado',
  })}
    
  ${Button({
    type: 'button',
    title: 'Postar',
    class: 'primary-button post-btn',
    onClick: newPost,
    disabled: 'disabled',
  })}
  </div>
      </div>

        <div class='container posts'> ${app.postsTemplate} </div>
      </section>
    </section>
  `;
  return template;
};

const changeViewPost = (e) => {
  document.querySelector('.posts').innerHTML = '';
  const value = e.target.value;
  if (value === 'false') {
    firebase.firestore().collection('posts')
      .where('private', '==', value)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((post) => {
          const docPost = {
            ...post.data(),
            id: post.id,
          };
          document.querySelector('.posts').innerHTML += app.postTemplate(docPost);
        });
      });
  } else {
    const currentUser = app.auth.currentUser.uid;
    firebase.firestore().collection('posts')
      .where('user', '==', currentUser)
      .where('private', '==', value)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((post) => {
          const docPost = {
            ...post.data(),
            id: post.id,
          };
          document.querySelector('.posts').innerHTML += app.postTemplate(docPost);

        });
      });
  }
};

const Profile = () => {
  const username = app.auth.currentUser;
  const user = app.auth.currentUser.uid;
  const name = username.displayName.trim();

  const templateProfile = `<div class="photo-profile">
      <div class="cover">
      <img class="cover"src="../image/cover.png"/>
      </div>
      <div class="profile">
      <i class="far fa-user user-icon"></i>
          <h1 class="">${name}</h1>
          ${actionIcon({
    class: 'edit-btn minibtns fas fa-pencil-alt',
    name: user.user,
    dataDocid: user.id,
    onClick: editProfile,
  })}      
          ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name: user.user,
    dataDocid: user.id,
    onClick: updateProfile,
  })}   
      

     </div> 
   </div> 
      `;
  return templateProfile;
};

const editProfile = (pencilIcon) => {
  pencilIcon.className = 'edit-btn minibtns fas fa-pencil-alt hide';
  pencilIcon.nextElementSibling.className = 'save-btn minibtns show fas fa-check';
  pencilIcon.previousElementSibling.contentEditable = true;
  pencilIcon.previousElementSibling.className += 'editable-text';
};

const updateProfile = (checkIcon) => {
  checkIcon.className = 'save-btn minibtns hide fas fa-check';
  checkIcon.previousElementSibling.className = 'edit-btn minibtns fas fa-pencil-alt show';
  const pName = checkIcon.previousElementSibling.previousElementSibling;
  pName.contentEditable = false;
  pName.className = 'username';




  const user = app.auth.currentUser;
  user.updateProfile({
    displayName: pName.textContent,
    name: pName.textContent,
  });

  app.db.collection('posts').where('user', '==', user.uid)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        app.db.collection('posts').doc(doc.id).update({ name: pName.textContent });
      });
    });
};


window.app = {
  postsTemplate: '',
  postTemplate,
  db: firebase.firestore(),
  auth: firebase.auth(),
};
window.changeViewPost = changeViewPost;

export default Feed;
