auth.onAuthStateChanged(user => {
  if (user) {
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    const publicPages = ['', 'index'];
    if (!publicPages.includes(page)) return;
    if (sessionStorage.getItem('signingUp') === 'true') return;
    window.location.href = 'dashboard.html';
  } else {
    const protectedPages = ['dashboard', 'content', 'leaderboard'];
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    if (protectedPages.includes(page)) {
      window.location.href = 'index.html';
    }
  }
});

async function signup(email, password, name) {
  sessionStorage.setItem('signingUp', 'true');
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  await db.collection('users').doc(cred.user.uid).set({
    name, email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    streak: { current: 0, longest: 0, lastActiveDate: '' },
    progress: { busuuChapters: [], playlist1Videos: [], playlist2Videos: [], bookChapters: [] },
    totalPoints: 0
  });
  sessionStorage.removeItem('signingUp');
  return cred.user;
}

async function login(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  return cred.user;
}

async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const cred = await auth.signInWithPopup(provider);
  const user = cred.user;
  const doc = await db.collection('users').doc(user.uid).get();
  if (!doc.exists) {
    await db.collection('users').doc(user.uid).set({
      name: user.displayName, email: user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      progress: { busuuChapters: [], playlist1Videos: [], playlist2Videos: [], bookChapters: [] },
      totalPoints: 0
    });
  }
  return user;
}

function logout() {
  auth.signOut();
  window.location.href = 'index.html';
}
