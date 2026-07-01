auth.onAuthStateChanged(async user => {
  if (!user) return;

  const doc = await db.collection('users').doc(user.uid).get();
  if (!doc.exists) {
    await db.collection('users').doc(user.uid).set({
      name: user.displayName || user.email.split('@')[0], email: user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      progress: { busuuChapters: [], playlist1Videos: [], playlist2Videos: [], bookChapters: [] },
      totalPoints: 0
    });
    return window.location.reload();
  }

  const data = doc.data();
  const streak = data.streak || { current: 0, longest: 0 };
  const progress = data.progress || {};
  const totalPoints = data.totalPoints || 0;

  document.getElementById('user-name').textContent = data.name || 'Lerner';
  document.getElementById('streak-count').textContent = `${streak.current} Tage`;
  document.getElementById('streak-longest').textContent = `${streak.longest} Tage`;
  document.getElementById('total-points').textContent = totalPoints.toLocaleString();

  const today = new Date().toISOString().slice(0, 10);
  const todayLog = await db.collection('dailyLogs').doc(`${user.uid}_${today}`).get();
  const todayCount = todayLog.exists ? todayLog.data().itemsCompletedToday?.length || 0 : 0;
  document.getElementById('today-items').textContent = `${todayCount} today`;

  const busuuDone = progress.busuuChapters?.length || 0;
  const yt1Done = progress.playlist1Videos?.length || 0;
  const yt2Done = progress.playlist2Videos?.length || 0;
  const bookDone = progress.bookChapters?.length || 0;
  document.getElementById('busuu-progress').textContent = `${busuuDone}/31`;
  document.getElementById('yt1-progress').textContent = `${yt1Done}/58`;
  document.getElementById('yt2-progress').textContent = `${yt2Done}/83`;
  document.getElementById('book-progress').textContent = `${bookDone}/24`;

  const totalItems = busuuDone + yt1Done + yt2Done + bookDone;
  document.getElementById('total-items').textContent = totalItems;
});
