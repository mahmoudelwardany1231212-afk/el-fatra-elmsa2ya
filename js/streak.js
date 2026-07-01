const STREAK = {
  update(userData) {
    const today = new Date().toISOString().slice(0, 10);
    const last = userData.streak?.lastActiveDate;

    if (last === today) return { ...userData.streak, lastActiveDate: today };

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let current = last === yesterday ? (userData.streak?.current || 0) + 1 : 1;
    let longest = Math.max(userData.streak?.longest || 0, current);

    return { current, longest, lastActiveDate: today };
  },

  calcPoints(progress, streak) {
    const busuuPts = (progress?.busuuChapters?.length || 0) * 3;
    const bookPts = (progress?.bookChapters?.length || 0) * 2;
    const ytPts = (progress?.playlist1Videos?.length || 0) + (progress?.playlist2Videos?.length || 0);
    const streakBonus = (streak?.current || 0) * 2;
    return busuuPts + bookPts + ytPts + streakBonus;
  },

  async saveActivity(uid, items) {
    const today = new Date().toISOString().slice(0, 10);
    const logId = `${uid}_${today}`;
    await db.collection('dailyLogs').doc(logId).set({
      uid, date: today, itemsCompletedToday: firebase.firestore.FieldValue.arrayUnion(...items), timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }
};
