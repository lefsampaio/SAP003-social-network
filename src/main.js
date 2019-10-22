import Register from './pages/register.js';
import Login from './pages/login.js';
import Feed from './pages/feed.js';

const main = document.querySelector('main');

const authCheck = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      location.hash = '#feed';
      const posts = [];

      // firebase.firestore().collection('posts')
      //   .orderBy('timestamp', 'desc')
      //   .onSnapshot((querySnapshot) => {
      //     main.innerHTML = Feed({ posts: querySnapshot });
      //   })

      firebase.firestore().collection('posts')
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((firebasePost) => {
            const post = { ...firebasePost.data(), comments: [] };
            firebasePost.ref.collection('comments').get()
              .then((querySnapshot2) => {
                querySnapshot2.forEach((comment) => {
                  if (comment) {
                    post.comments.push(comment.data());
                  }
                });
                posts.push(post);
              });
          });
        })
        .then(() => {
          main.innerHTML = Feed({ posts });
        });
      // console.log(posts);
    } else {
      location.hash = '';
    }
  });
};

const routes = () => {
  if (location.hash === '#register') {
    main.innerHTML = Register();
  } else if (location.hash === '') {
    main.innerHTML = Login();
  } else if (location.hash === '#feed') {
    authCheck();
  }
};


window.addEventListener('load', routes);
window.addEventListener('hashchange', routes);
