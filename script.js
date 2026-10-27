/* ===== Dados ===== */
const PRODUTOS = [
 {id:1,nome:'Camisa I 26/27 Torcedor',cat:'Camisas',preco:279.9,cor:'#fff',cor2:'#111',tipo:'faixa',desc:'Manto branco com a tradicional faixa diagonal preta. Tecido dry-fit leve.'},
 {id:2,nome:'Camisa II 26/27 Torcedor',cat:'Camisas',preco:279.9,cor:'#111',cor2:'#fff',tipo:'faixa',desc:'Segundo uniforme preto com faixa diagonal branca.'},
 {id:3,nome:'Camisa III 26/27 Torcedor',cat:'Camisas',preco:269.9,cor:'#e9e6a8',cor2:'#111',tipo:'faixa',desc:'Terceiro uniforme em tom areia com detalhes pretos.'},
 {id:4,nome:'Camisa Retrô 1948',cat:'Camisas',preco:229.9,cor:'#fff',cor2:'#d3001c',tipo:'faixa',desc:'Releitura do histórico Expresso da Vitória.'},
 {id:5,nome:'Jaqueta Presença',cat:'Agasalhos',preco:349.9,cor:'#222',cor2:'#d3001c',tipo:'liso',desc:'Jaqueta corta-vento para dias frios na arquibancada.'},
 {id:6,nome:'Moletom Gigante',cat:'Agasalhos',preco:299.9,cor:'#777',cor2:'#111',tipo:'liso',desc:'Moletom com capuz e escudo bordado.'},
 {id:7,nome:'Camiseta Casual Bege',cat:'Camisetas',preco:99.9,cor:'#d9c3a0',cor2:'#111',tipo:'liso',desc:'100% algodão, para usar todo dia.'},
 {id:8,nome:'Camiseta Cruz de Malta',cat:'Camisetas',preco:109.9,cor:'#111',cor2:'#d3001c',tipo:'liso',desc:'Camiseta preta com estampa da Cruz de Malta.'},
 {id:9,nome:'Camiseta Vinho Torcida',cat:'Camisetas',preco:99.9,cor:'#6b1a24',cor2:'#fff',tipo:'liso',desc:'Camiseta vinho edição torcida.'},
 {id:10,nome:'Boné Aba Reta',cat:'Acessórios',preco:89.9,cor:'#111',cor2:'#fff',tipo:'liso',desc:'Boné preto com escudo bordado.'},
 {id:11,nome:'Cachecol Oficial',cat:'Acessórios',preco:69.9,cor:'#fff',cor2:'#111',tipo:'faixa',desc:'Cachecol de acrílico preto e branco.'},
 {id:12,nome:'Caneca do Gigante',cat:'Acessórios',preco:49.9,cor:'#fff',cor2:'#d3001c',tipo:'liso',desc:'Caneca de cerâmica 300 ml.'}
];
const CATEGORIAS = ['Camisas','Agasalhos','Camisetas','Acessórios'];
const MAX_PARCELAS = 6;
const CUPONS = {VASCO10:0.10};

/* ===== Estado ===== */
let carrinho = JSON.parse(localStorage.getItem('vashop_cart') || '[]');
let cupom = null;
let tamanho = 'M';
const $ = s => document.querySelector(s);
const R$ = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const salvar = () => { localStorage.setItem('vashop_cart', JSON.stringify(carrinho)); $('#qtdCarrinho').textContent = carrinho.reduce((s,i)=>s+i.qtd,0); };

/* ===== Imagem (SVG gerado) ===== */
function camisa(p){
  const corpo = 'M30 10 L8 26 L18 42 L26 36 L26 90 L74 90 L74 36 L82 42 L92 26 L70 10 Q50 24 30 10Z';
  const faixa = p.tipo==='faixa' ? `<clipPath id="c${p.id}"><path d="${corpo}"/></clipPath><polygon clip-path="url(#c${p.id})" points="20,10 45,10 80,90 55,90" fill="${p.cor2}"/>` : '';
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${p.nome}"><path d="${corpo}" fill="${p.cor}" stroke="#999" stroke-width="1"/>${faixa}<circle cx="64" cy="30" r="5" fill="#d3001c" stroke="#fff" stroke-width="1"/></svg>`;
}

/* ===== Cards ===== */
function cardHTML(p){
  return `<article class="card"><div class="img" onclick="location.hash='produto/${p.id}'">${camisa(p)}</div>
  <h3 onclick="location.hash='produto/${p.id}'">${p.nome}</h3><p>${p.desc}</p>
  <div class="preco">${R$(p.preco)}<br><small>ou ${MAX_PARCELAS}x de ${R$(p.preco/MAX_PARCELAS)}</small></div>
  <button class="btn" onclick="adicionar(${p.id})">Adicionar ao carrinho</button></article>`;
}

/* ===== Carrinho ===== */
function adicionar(id, tam){
  const it = carrinho.find(i=>i.id===id && i.tam===(tam||null));
  it ? it.qtd++ : carrinho.push({id,qtd:1,tam:tam||null});
  salvar(); alert('Produto adicionado ao carrinho!');
}
function mudarQtd(idx,d){ carrinho[idx].qtd += d; if(carrinho[idx].qtd<1) carrinho.splice(idx,1); salvar(); renderCarrinho(); }
function remover(idx){ carrinho.splice(idx,1); salvar(); renderCarrinho(); }
function totais(){
  const sub = carrinho.reduce((s,i)=>s+PRODUTOS.find(p=>p.id===i.id).preco*i.qtd,0);
  const desc = cupom ? sub*CUPONS[cupom] : 0;
  const frete = sub===0 || sub>=300 ? 0 : 19.9;
  return {sub,desc,frete,total:sub-desc+frete};
}
function resumoHTML(botao){
  const t = totais();
  return `<h3>Resumo</h3>
  <div class="linha"><span>Subtotal</span><span>${R$(t.sub)}</span></div>
  ${t.desc?`<div class="linha"><span>Cupom ${cupom}</span><span>-${R$(t.desc)}</span></div>`:''}
  <div class="linha"><span>Frete</span><span>${t.frete?R$(t.frete):'Grátis'}</span></div>
  <div class="linha total"><span>Total</span><span>${R$(t.total)}</span></div>${botao}`;
}
function renderCarrinho(){
  $('#itens').innerHTML = carrinho.length ? carrinho.map((i,idx)=>{
    const p = PRODUTOS.find(x=>x.id===i.id);
    return `<div class="item">${camisa(p)}<div><strong>${p.nome}</strong>${i.tam?` <small>(Tam. ${i.tam})</small>`:''}
      <div class="qtd"><button onclick="mudarQtd(${idx},-1)" aria-label="Diminuir">−</button><span>${i.qtd}</span><button onclick="mudarQtd(${idx},1)" aria-label="Aumentar">+</button>
      <button class="rem" onclick="remover(${idx})">Remover</button></div></div><div class="preco">${R$(p.preco*i.qtd)}</div></div>`;
  }).join('') : '<p class="vazio">Seu carrinho está vazio. <a href="#produtos" class="link">Ver produtos</a></p>';
  $('#resumo').innerHTML = resumoHTML(`
    <div class="cupom"><input id="cupom" placeholder="Cupom (VASCO10)"><button class="btn" onclick="aplicarCupom()">OK</button></div>
    <button class="btn btn-red" ${carrinho.length?'':'disabled'} onclick="location.hash='checkout'">Finalizar compra</button>`);
}
function aplicarCupom(){
  const c = $('#cupom').value.trim().toUpperCase();
  if(CUPONS[c]){cupom=c;renderCarrinho();} else alert('Cupom inválido.');
}

/* ===== Telas ===== */
function renderHome(){
  $('#gridHome').innerHTML = PRODUTOS.slice(0,4).map(cardHTML).join('');
  $('#bannerImg').innerHTML = camisa(PRODUTOS[0]);
  $('#catsHome').innerHTML = CATEGORIAS.map(c=>`<a class="cat" href="#produtos/${c}">${c}</a>`).join('');
}
function renderLista(cat){
  const sel = $('#fCat');
  sel.innerHTML = '<option value="">Todas as categorias</option>'+CATEGORIAS.map(c=>`<option ${c===cat?'selected':''}>${c}</option>`).join('');
  filtrar();
}
function filtrar(){
  const cat=$('#fCat').value, ord=$('#fOrd').value, q=$('#busca').value.toLowerCase();
  let l = PRODUTOS.filter(p=>(!cat||p.cat===cat)&&(!q||p.nome.toLowerCase().includes(q)));
  if(ord==='menor') l.sort((a,b)=>a.preco-b.preco); if(ord==='maior') l.sort((a,b)=>b.preco-a.preco);
  $('#tituloLista').textContent = cat || 'Todos os produtos';
  $('#gridProdutos').innerHTML = l.length ? l.map(cardHTML).join('') : '<p class="vazio">Nenhum produto encontrado.</p>';
}
function renderDetalhe(id){
  const p = PRODUTOS.find(x=>x.id==id); if(!p) return location.hash='produtos';
  tamanho='M';
  const tams = p.cat==='Acessórios' ? '' : `<div class="tam">${['P','M','G','GG'].map(t=>`<button class="${t==='M'?'sel':''}" onclick="escolherTam('${t}',this)">${t}</button>`).join('')}</div>`;
  $('#detalhe').innerHTML = `<div class="img">${camisa(p)}</div><div><small>${p.cat}</small><h1>${p.nome}</h1><p>${p.desc}</p>
    <div class="preco">${R$(p.preco)}<br><small>ou ${MAX_PARCELAS}x de ${R$(p.preco/MAX_PARCELAS)} sem juros</small></div>${tams}
    <button class="btn btn-red" onclick="adicionar(${p.id},${tams?'tamanho':'null'})">Adicionar ao carrinho</button>
    <button class="btn" onclick="adicionar(${p.id},${tams?'tamanho':'null'});location.hash='carrinho'">Comprar agora</button></div>`;
}
function escolherTam(t,el){ tamanho=t; document.querySelectorAll('.tam button').forEach(b=>b.classList.remove('sel')); el.classList.add('sel'); }

function renderCheckout(){
  if(!carrinho.length) return location.hash='carrinho';
  $('#resumoCheck').innerHTML = resumoHTML('<button class="btn btn-red">Confirmar pedido</button>');
  const t = totais().total;
  $('#parc').innerHTML = Array.from({length:MAX_PARCELAS},(_,i)=>`<option>${i+1}x de ${R$(t/(i+1))} sem juros</option>`).join('');
  mostrarPag();
}
function mostrarPag(){
  const f = document.querySelector('input[name=pag]:checked').value;
  $('#boxCartao').hidden = f==='pix'; $('#boxPix').hidden = f!=='pix'; $('#parc').hidden = f!=='credito';
}

/* ===== Roteador ===== */
function rotear(){
  const [view,param] = (location.hash.slice(1)||'login').split('/');
  const logado = localStorage.getItem('vashop_user');
  const nome = ['login','home','categorias','produtos','produto','carrinho','checkout','sucesso'].includes(view)?view:'home';
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.dataset.view===nome));
  $('#topo').hidden = nome==='login';
  $('#sair').hidden = !logado;
  if(nome==='home') renderHome();
  if(nome==='categorias') $('#catsPage').innerHTML = CATEGORIAS.map(c=>`<a class="cat" href="#produtos/${decodeURIComponent(c)}">${c}</a>`).join('');
  if(nome==='produtos') renderLista(param?decodeURIComponent(param):'');
  if(nome==='produto') renderDetalhe(param);
  if(nome==='carrinho') renderCarrinho();
  if(nome==='checkout') renderCheckout();
  window.scrollTo(0,0);
}

/* ===== Eventos ===== */
$('#formLogin').addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('vashop_user',$('#lEmail').value);location.hash='home';});
$('#sair').addEventListener('click',()=>localStorage.removeItem('vashop_user'));
$('#busca').addEventListener('input',()=>{ if(!location.hash.startsWith('#produtos')) location.hash='produtos'; else filtrar(); });
$('#fCat').addEventListener('change',filtrar); $('#fOrd').addEventListener('change',filtrar);
document.querySelectorAll('input[name=pag]').forEach(r=>r.addEventListener('change',mostrarPag));
$('#formPedido').addEventListener('submit',e=>{
  e.preventDefault();
  const f = e.target, pag = f.pag.value;
  const obrig = ['nome','email','cpf','tel','cep','end'].concat(pag==='pix'?[]:['numero','titular','val','cvv']);
  let ok = true;
  obrig.forEach(n=>{ const c=f[n]; const vazio=!c.value.trim(); c.classList.toggle('erro',vazio); if(vazio) ok=false; });
  if(f.cpf.value.replace(/\D/g,'').length!==11){ f.cpf.classList.add('erro'); ok=false; }
  if(!ok) return alert('Preencha corretamente os campos destacados.');
  const num = 'VAS'+Date.now().toString().slice(-6);
  const forma = {debito:'cartão de débito',credito:`cartão de crédito em ${f.parc.value.split(' ')[0]}`,pix:'PIX'}[pag];
  $('#msgSucesso').textContent = `Obrigado, ${f.nome.value.split(' ')[0]}! Pedido ${num} pago com ${forma}. Total: ${R$(totais().total)}.`;
  carrinho=[]; cupom=null; salvar(); f.reset(); location.hash='sucesso';
});
window.addEventListener('hashchange',rotear);
salvar(); rotear();
