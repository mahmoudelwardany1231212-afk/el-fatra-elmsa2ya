async function loadLeaderboard() {
  const snap = await db.collection('users').orderBy('totalPoints', 'desc').get();
  const list = document.getElementById('leaderboard-list');
  const podium = document.getElementById('podium');
  let rank = 0;
  let rows = '';
  let top3 = [];

  snap.forEach(doc => {
    const d = doc.data();
    rank++;
    const entry = { id: doc.id, name: d.name || 'Unknown', streak: d.streak?.current || 0, points: d.totalPoints || 0, rank };
    if (rank <= 3) top3.push(entry);

    const isMe = doc.id === (auth.currentUser?.uid || '');
    rows += `
      <div class="flex items-center justify-between p-4 ${isMe ? 'bg-surface-container border-2 border-primary rounded-lg relative overflow-hidden' : 'bg-surface-container-lowest border border-surface-dim rounded-lg hover:border-outline transition-colors'}">
        ${isMe ? '<div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>' : ''}
        <div class="w-12 text-center font-headline font-bold text-lg ${isMe ? 'text-primary relative z-10' : 'text-on-surface-variant'}">${rank}</div>
        <div class="flex-grow ml-4 flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant">${(d.name || 'U')[0].toUpperCase()}</div>
          <span class="font-headline font-semibold text-on-surface ${isMe ? 'text-primary' : ''}">${d.name || 'Unknown'} ${isMe ? '(Du)' : ''}</span>
        </div>
        <div class="w-24 flex items-center justify-center gap-1 text-primary font-semibold">
          <span class="material-symbols-outlined text-sm symbol-fill">local_fire_department</span>
          ${d.streak?.current || 0}
        </div>
        <div class="w-24 text-right font-medium text-on-surface">${(d.totalPoints || 0).toLocaleString()}</div>
      </div>`;
  });

  // Podium
  const medalIcons = ['emoji_events', 'emoji_events', 'emoji_events'];
  const medalColors = ['bg-traffic-gold border-traffic-gold', 'bg-surface-dim border-outline', 'bg-outline-variant border-outline-variant'];
  const heights = ['h-[300px] md:-translate-y-4', 'h-[260px]', 'h-[240px]'];
  const order = ['md:order-2', 'md:order-1', 'md:order-3'];
  const size = ['w-24 h-24', 'w-20 h-20', 'w-16 h-16'];

  let podiumHtml = '';
  // Reorder for visual display: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const visualOrder = top3.length >= 3 ? ['md:order-1', 'md:order-2', 'md:order-3'] : ['md:order-2', 'md:order-1', 'md:order-3'];
  const visualHeights = top3.length >= 3 ? ['h-[260px]', 'h-[300px] md:-translate-y-4', 'h-[240px]'] : ['h-[300px] md:-translate-y-4', 'h-[260px]', 'h-[240px]'];

  podiumOrder.forEach((entry, i) => {
    const realRank = entry.rank;
    podiumHtml += `
      <div class="order-${i+1} ${visualOrder[i]} bg-surface-container-lowest border ${realRank === 1 ? 'border-2 border-traffic-gold' : 'border-concrete-gray'} rounded-xl p-6 flex flex-col items-center shadow-sm relative ${visualHeights[i]} justify-end transform hover:-translate-y-1 transition-transform">
        <div class="absolute -top-6 ${realRank === 1 ? 'bg-traffic-gold border-2 border-surface-container-lowest w-16 h-16' : 'bg-surface-dim border border-concrete-gray w-12 h-12'} rounded-full flex items-center justify-center font-headline font-bold text-xl shadow-sm z-10">
          ${realRank === 1 ? '<span class="material-symbols-outlined icon-fill text-2xl">emoji_events</span>' : realRank}
        </div>
        <div class="${size[i]} rounded-full border-4 ${realRank === 1 ? 'border-traffic-gold' : 'border-surface-dim'} overflow-hidden mb-4 flex items-center justify-center bg-surface-container-high font-bold text-xl">${(entry.name || 'U')[0].toUpperCase()}</div>
        <h3 class="font-headline font-bold text-lg text-berlin-ink mb-1">${entry.name}</h3>
        <div class="flex items-center gap-2 text-primary font-bold mb-3">
          <span class="material-symbols-outlined icon-fill text-lg">local_fire_department</span>
          <span>${entry.streak}</span>
        </div>
        <div class="${realRank === 1 ? 'text-berlin-ink font-bold bg-traffic-gold/20 px-3 py-1 rounded-full' : 'text-on-surface-variant font-medium text-sm'}">${entry.points.toLocaleString()} Pkt</div>
      </div>`;
  });

  podium.innerHTML = podiumHtml || '<p class="text-center text-on-surface-variant py-8">Noch keine Teilnehmer</p>';
  list.innerHTML = rows || '<p class="text-center text-on-surface-variant py-8">Noch keine Daten</p>';
}

auth.onAuthStateChanged(user => {
  if (user) loadLeaderboard();
});
