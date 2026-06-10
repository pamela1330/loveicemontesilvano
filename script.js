(function(){
  'use strict';
  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function(){
    var banner = document.getElementById('cookie-banner');
    var btn = document.getElementById('accept-cookies');
    try {
      if (banner && localStorage.getItem('loveice_cookie_ok') !== '1') banner.classList.add('show');
      if (btn) btn.addEventListener('click', function(){
        localStorage.setItem('loveice_cookie_ok','1');
        if (banner) banner.classList.remove('show');
      });
    } catch(e) {
      if (banner) banner.classList.add('show');
      if (btn) btn.addEventListener('click', function(){ banner.classList.remove('show'); });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click', function(e){
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null, '', id);
        }
      });
    });

    var searchInput = document.getElementById('menu-search');
    if (searchInput) {
      var items = Array.prototype.slice.call(document.querySelectorAll('#menu .menu-item, #menu .drink-item'));
      var clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'search-clear';
      clearBtn.textContent = 'Mostra tutto';
      clearBtn.style.display = 'none';
      searchInput.insertAdjacentElement('afterend', clearBtn);

      function normalize(str){
        return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      function resetHighlights(){
        items.forEach(function(item){
          item.classList.remove('search-focus','search-dim');
          item.style.order = '';
        });
      }
      function runSearch(){
        var q = normalize(searchInput.value.trim());
        resetHighlights();
        clearBtn.style.display = q ? 'inline-flex' : 'none';
        if (!q) return;
        var firstMatch = null;
        items.forEach(function(item){
          var text = normalize(item.textContent);
          if (text.indexOf(q) !== -1) {
            item.classList.add('search-focus');
            item.style.order = '-1';
            if (!firstMatch) firstMatch = item;
          } else {
            item.classList.add('search-dim');
          }
        });
        if (firstMatch) {
          window.requestAnimationFrame(function(){
            firstMatch.scrollIntoView({behavior:'smooth', block:'center'});
          });
        }
      }
      var timer;
      searchInput.addEventListener('input', function(){
        clearTimeout(timer);
        timer = setTimeout(runSearch, 120);
      });
      searchInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter') { e.preventDefault(); runSearch(); }
        if(e.key === 'Escape') { searchInput.value=''; resetHighlights(); clearBtn.style.display='none'; }
      });
      clearBtn.addEventListener('click', function(){
        searchInput.value = '';
        resetHighlights();
        clearBtn.style.display = 'none';
        searchInput.focus();
      });
    }
  });
})();
