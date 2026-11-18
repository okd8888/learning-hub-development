const searchDialog = document.querySelector<HTMLElement>('[data-search-dialog]');
const searchInput = searchDialog?.querySelector<HTMLInputElement>('input[type="search"]');
let previousFocus:HTMLElement|null=null;
const openSearch = () => { previousFocus=document.activeElement as HTMLElement|null;searchDialog?.classList.add('is-open'); searchDialog?.setAttribute('aria-hidden', 'false'); searchInput?.focus(); };
const closeSearch = () => { searchDialog?.classList.remove('is-open'); searchDialog?.setAttribute('aria-hidden', 'true'); previousFocus?.focus(); };
document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  if (event.key === 'Escape') closeSearch();
  if(event.key==='Tab'&&searchDialog?.classList.contains('is-open')){const focusable=[...searchDialog.querySelectorAll<HTMLElement>('input,select,button,a[href]')].filter(item=>!item.hasAttribute('disabled'));const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}
});
document.querySelector('[data-search-close]')?.addEventListener('click', closeSearch);
searchDialog?.addEventListener('click',(event)=>{if(event.target===searchDialog)closeSearch()});

const siteId=document.documentElement.dataset.siteId??'learning-hub';
const readerKey = `learninghub:${siteId}:reader:v1`;
type ReaderState = { schemaVersion: 1; favorites:Record<string,string>; read:Record<string,string>; history:Record<string,{lastVisitedAt:string;progress:number}>; preferences:{view:'grid'|'list'} };
const emptyReaderState = ():ReaderState => ({schemaVersion:1,favorites:{},read:{},history:{},preferences:{view:'grid'}});
function readReaderState():ReaderState { try { const value=JSON.parse(localStorage.getItem(readerKey)??'null'); return value?.schemaVersion===1?{...emptyReaderState(),...value}:emptyReaderState(); } catch { return emptyReaderState(); } }
function saveReaderState(state:ReaderState) { try { localStorage.setItem(readerKey,JSON.stringify(state)); document.dispatchEvent(new CustomEvent('reader-state-change')); } catch { document.dispatchEvent(new CustomEvent('reader-storage-error')); } }
function renderReaderButtons() {
  const state=readReaderState();
  document.querySelectorAll<HTMLButtonElement>('[data-favorite]').forEach(button=>{ const active=Boolean(state.favorites[button.dataset.favorite??'']);button.textContent=button.classList.contains('mini-save')?(active?'★':'☆'):(active?'★ 已收藏':'☆ 收藏');button.setAttribute('aria-pressed',String(active)); });
  document.querySelectorAll<HTMLButtonElement>('[data-mark-read]').forEach(button=>{const active=Boolean(state.read[button.dataset.markRead??'']);button.textContent=active?'✓ 已讀':'標記已讀';button.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll<HTMLElement>('[data-card-status]').forEach(item=>{item.textContent=state.read[item.dataset.cardStatus??'']?'已讀':'';});
}
renderReaderButtons();
document.addEventListener('click',(event)=>{
  const target=event.target as HTMLElement;
  const favorite=target.closest<HTMLButtonElement>('[data-favorite]');
  const markRead=target.closest<HTMLButtonElement>('[data-mark-read]');
  if(favorite){const state=readReaderState(),id=favorite.dataset.favorite!;state.favorites[id]?delete state.favorites[id]:state.favorites[id]=new Date().toISOString();saveReaderState(state);renderReaderButtons();}
  if(markRead){const state=readReaderState(),id=markRead.dataset.markRead!;state.read[id]?delete state.read[id]:state.read[id]=new Date().toISOString();saveReaderState(state);renderReaderButtons();}
});
window.addEventListener('storage',(event)=>{if(event.key===readerKey)renderReaderButtons();});
document.addEventListener('reader-state-change',renderReaderButtons);

if(document.querySelector('[data-pagefind-body]')){
  const stableId=document.querySelector<HTMLButtonElement>('[data-mark-read]')?.dataset.markRead;
  if(stableId){const state=readReaderState();state.history[stableId]={lastVisitedAt:new Date().toISOString(),progress:0};const recent=Object.entries(state.history).sort((a,b)=>b[1].lastVisitedAt.localeCompare(a[1].lastVisitedAt)).slice(0,200);state.history=Object.fromEntries(recent);saveReaderState(state);}
}

document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre)=>{
  const code=pre.querySelector('code');if(!code)return;
  if(code.className.includes('language-mermaid')){const diagram=document.createElement('div');diagram.className='mermaid';diagram.textContent=code.textContent??'';pre.replaceWith(diagram);return;}
  const frame=document.createElement('div');frame.className='code-frame';pre.replaceWith(frame);frame.append(pre);const button=document.createElement('button');button.type='button';button.dataset.codeCopy='';button.textContent='複製';button.setAttribute('aria-label','複製程式碼');frame.append(button);
});
document.querySelectorAll<HTMLButtonElement>('[data-share]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.share({title:document.title,url:location.href});}catch{await navigator.clipboard?.writeText(location.href);button.textContent='已複製連結';setTimeout(()=>button.textContent='分享',1500);}}));
document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]').forEach(link=>{
  const heading=document.getElementById(decodeURIComponent(link.hash.slice(1)));if(!heading)return;
  new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){document.querySelectorAll('.toc-list a').forEach(item=>item.classList.remove('is-active'));link.classList.add('is-active');}},{rootMargin:'-15% 0px -70% 0px'}).observe(heading);
});

const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); document.querySelector('.main-nav')?.classList.toggle('is-open', open); });

document.addEventListener('click', async (event) => {
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-code-copy]');if(!button)return;
  const code = button.closest('.code-frame')?.querySelector('code')?.textContent ?? '';
  try { await navigator.clipboard.writeText(code); button.textContent = '已複製'; }
  catch { const range = document.createRange(); const target = button.closest('.code-frame')?.querySelector('code'); if (target) { range.selectNodeContents(target); getSelection()?.removeAllRanges(); getSelection()?.addRange(range); button.textContent = '請手動複製'; } }
  window.setTimeout(() => { button.textContent = '複製'; }, 1800);
});

let lastImage:HTMLImageElement|null=null;
document.querySelectorAll<HTMLImageElement>('.prose img').forEach((img) => {
  img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', `放大圖片：${img.alt}`);
  const open = () => { const dialog = document.querySelector<HTMLDialogElement>('[data-image-dialog]'); const large = dialog?.querySelector('img'); if (dialog && large) { lastImage=img;large.src = img.src; large.alt = img.alt; dialog.showModal(); } };
  img.addEventListener('click', open); img.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') open(); });
});
document.querySelector('[data-image-dialog]')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close(); });
document.querySelector('[data-image-dialog]')?.addEventListener('close',()=>lastImage?.focus());

document.querySelectorAll<HTMLElement>('.mermaid').forEach(async (el) => {
  try { const { default: mermaid } = await import('mermaid'); mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default' }); await mermaid.run({ nodes: [el] }); }
  catch { el.classList.add('mermaid-error'); el.setAttribute('role', 'img'); el.setAttribute('aria-label', '流程圖渲染失敗，以下顯示原始碼'); }
});

document.querySelectorAll<HTMLElement>('[data-reading-progress]').forEach((bar) => {
  const article = document.querySelector<HTMLElement>('[data-pagefind-body]'); if (!article) return;
  const stableId=document.querySelector<HTMLButtonElement>('[data-mark-read]')?.dataset.markRead;
  let lastSave=0;
  const update = () => {
    const rect = article.getBoundingClientRect(); const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height)));
    bar.style.setProperty('--reading-progress', `${progress * 100}%`);
    const nudge=document.querySelector<HTMLElement>('[data-read-nudge]');if(nudge&&progress>=.9)nudge.hidden=false;
    if(stableId&&Date.now()-lastSave>2500){const state=readReaderState();state.history[stableId]={lastVisitedAt:new Date().toISOString(),progress:Math.round(progress*100)};saveReaderState(state);lastSave=Date.now();}
  };
  document.addEventListener('scroll', update, { passive: true }); update();
});

document.querySelectorAll<HTMLElement>('[data-path-progress]').forEach((container)=>{
  const ids=JSON.parse(container.dataset.steps??'[]') as string[];
  const render=()=>{const state=readReaderState();const read=ids.filter(id=>state.read[id]).length;const percent=ids.length?Math.round(read/ids.length*100):0;container.querySelector<HTMLElement>('span')?.style.setProperty('width',`${percent}%`);const label=container.parentElement?.querySelector<HTMLElement>('[data-path-progress-text]');if(label)label.textContent=`${percent}%`;container.parentElement?.querySelectorAll<HTMLElement>('[data-read-label]').forEach(item=>{item.textContent=state.read[item.dataset.readLabel??'']?'已讀':'尚未標記已讀';});};
  render();document.addEventListener('reader-state-change',render);window.addEventListener('storage',render);
});

const topButton = document.querySelector('[data-back-top]');
topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
