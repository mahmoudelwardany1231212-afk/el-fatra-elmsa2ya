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

  const nameEl = document.getElementById('user-name-display') || document.getElementById('user-name');
  if (nameEl) nameEl.textContent = data.name || 'Lerner';

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setText('streak-count', `${streak.current} Tage`);
  setText('streak-longest', `${streak.longest} Tage`);
  setText('total-points', totalPoints.toLocaleString());

  const today = new Date().toISOString().slice(0, 10);
  const todayLog = await db.collection('dailyLogs').doc(`${user.uid}_${today}`).get();
  const todayCount = todayLog.exists ? todayLog.data().itemsCompletedToday?.length || 0 : 0;
  setText('today-items', `${todayCount} today`);

  const busuuDone = progress.busuuChapters?.length || 0;
  const yt1Done = progress.playlist1Videos?.length || 0;
  const yt2Done = progress.playlist2Videos?.length || 0;
  const bookDone = progress.bookChapters?.length || 0;

  setText('busuu-progress', `${busuuDone}/31`);
  setText('yt1-progress', `${yt1Done}/58`);
  setText('yt2-progress', `${yt2Done}/83`);
  setText('book-progress', `${bookDone}/24`);

  setText('total-items', busuuDone + yt1Done + yt2Done + bookDone);
});
