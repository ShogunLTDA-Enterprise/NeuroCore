(() => {
  const K = 'neurocore:';
  const ler = (k, d = {}) => { try { return { ...d, ...JSON.parse(localStorage.getItem(K + k)) } } catch { return d } };
  const gravar = (k, v) => { try { localStorage.setItem(K + k, JSON.stringify(v)); return true } catch { return false } };
  const PAD = {
    fs: 1, contraste: false, legivel: false, espaco: false, foco: false, links: false,
    animacao: matchMedia('(prefers-reduced-motion: reduce)').matches
  };
  const MAPA = {
    contraste: 'alto-contraste', legivel: 'fonte-legivel', espaco: 'espacado',
    foco: 'foco-forte', links: 'links-sublinhados', animacao: 'sem-animacao'
  };
  let ac = ler('acess', PAD);

  const aplicar = () => {
    const r = document.documentElement;
    r.style.setProperty('--fs', ac.fs);
    for (const k in MAPA) r.classList.toggle(MAPA[k], !!ac[k]);
  };
  aplicar(); 

  const aviso = (m) => {
    const t = document.getElementById('aviso'); if (!t) return;
    t.textContent = m; t.classList.add('on');
    clearTimeout(aviso.t); aviso.t = setTimeout(() => t.classList.remove('on'), 2500);
  };
  const iniciais = (n) => (n || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();

  function pintarTopo() {
    const foto = ler('perfil').foto;
    // #btn-usuario = ícone das suas outras páginas | .usuario i = ícone das páginas de conta
    document.querySelectorAll('#btn-usuario, .usuario i').forEach(el => {
      el.classList.toggle('com-foto', !!foto);
      el.style.backgroundImage = foto ? `url(${foto})` : '';
    });
  }

  // Acessibilidade \\
  document.addEventListener('DOMContentLoaded', () => {

    const fs = document.getElementById('fs'), fsv = document.getElementById('fs-valor');
    const mostra = () => { if (fsv) fsv.textContent = Math.round(ac.fs * 100) + '%'; };
    if (fs) {
      fs.value = ac.fs; mostra();
      fs.addEventListener('input', () => { ac.fs = +fs.value; gravar('acess', ac); aplicar(); mostra(); });
    }
    const checks = () => document.querySelectorAll('[data-acess]').forEach(c => c.checked = !!ac[c.dataset.acess]);
    checks();
    document.querySelectorAll('[data-acess]').forEach(c => c.addEventListener('change', () => {
      ac[c.dataset.acess] = c.checked; gravar('acess', ac); aplicar();
    }));
    document.getElementById('restaurar')?.addEventListener('click', () => {
      ac = { ...PAD }; gravar('acess', ac); aplicar(); checks();
      if (fs) fs.value = ac.fs; mostra(); aviso('Padrões restaurados');
    });

    // Formularios que ficam salvos no navegador \\
    document.querySelectorAll('form[data-store]').forEach(f => {
      const k = f.dataset.store, d = ler(k);
      [...f.elements].forEach(e => {
        if (!e.name || d[e.name] === undefined) return;
        e.type === 'checkbox' ? e.checked = d[e.name] : e.value = d[e.name];
      });
      f.addEventListener('submit', ev => {
        ev.preventDefault();
        const n = { ...ler(k) };
        [...f.elements].forEach(e => { if (e.name) n[e.name] = e.type === 'checkbox' ? e.checked : e.value; });
        gravar(k, n); aviso('Alterações salvas'); pintarAvatar();
      });
    });

    // Avatar \\

    
    const av = document.getElementById('avatar');
    function pintarAvatar() {
      pintarTopo();           
      if (!av) return;
      
      if (!av) return;
      const p = ler('perfil');
      if (p.foto) { av.style.backgroundImage = `url(${p.foto})`; av.textContent = ''; }
      else { av.style.backgroundImage = ''; av.textContent = iniciais(document.getElementById('nome')?.value || p.nome); }
      
    }



    document.getElementById('foto')?.addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        if (r.result.length > 400000) return aviso('Imagem muito grande (máx. ~300 KB)');
        gravar('perfil', { ...ler('perfil'), foto: r.result }); pintarAvatar(); aviso('Foto atualizada');
      };
      r.readAsDataURL(f);
    });
    document.getElementById('sem-foto')?.addEventListener('click', () => {
      const p = ler('perfil'); delete p.foto; gravar('perfil', p); pintarAvatar();
    });

    //  Senha e exclusão que o bando de dados ainda não foi integrado \\
    document.getElementById('form-senha')?.addEventListener('submit', e => {
      e.preventDefault();
      const n = e.target.nova.value;
      if (n.length < 8) return aviso('A nova senha precisa ter 8 ou mais caracteres');
      if (n !== e.target.confirma.value) return aviso('As senhas não conferem');
      e.target.reset(); aviso('Senha válida. Envie ao seu back-end para salvar');
    });
    document.getElementById('excluir')?.addEventListener('click', () => {
      if (confirm('Excluir sua conta? Esta ação não pode ser desfeita.')) aviso('Envie o pedido ao seu back-end');
    });


    pintarAvatar();
  });
})();
