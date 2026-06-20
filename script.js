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


    function initActiveNavbar(){
      var navLinks = Array.prototype.slice.call(document.querySelectorAll('.top-actions .nav-pill'));
      if (!navLinks.length) return;

      function clearActive(){
        navLinks.forEach(function(a){
          a.classList.remove('active');
          a.removeAttribute('aria-current');
        });
      }

      function sameIndexPage(href){
        return href && (href.indexOf('index.html#') !== -1 || href.charAt(0) === '#');
      }

      function setActiveByHash(hash){
        clearActive();
        var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (page === 'gelati_e_torte.html') {
          var gt = navLinks.find(function(a){ return a.getAttribute('href') === 'gelati_e_torte.html'; });
          if (gt) { gt.classList.add('active'); gt.setAttribute('aria-current','page'); }
          return;
        }

        var targetHash = hash || location.hash || '#home';
        var active = navLinks.find(function(a){
          var href = a.getAttribute('href') || '';
          return href === targetHash || href === 'index.html' + targetHash;
        });
        if (!active && targetHash !== '#home') {
          active = navLinks.find(function(a){ return (a.getAttribute('href') || '').indexOf('#home') !== -1; });
        }
        if (active) { active.classList.add('active'); active.setAttribute('aria-current','page'); }
      }

      navLinks.forEach(function(link){
        link.addEventListener('click', function(e){
          var href = link.getAttribute('href') || '';
          if (sameIndexPage(href)) {
            var hash = href.charAt(0) === '#' ? href : href.substring(href.indexOf('#'));
            var target = document.querySelector(hash);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({behavior:'smooth', block:'start'});
              history.replaceState(null, '', hash);
              setActiveByHash(hash);
            }
          } else if (href === 'gelati_e_torte.html') {
            clearActive();
            link.classList.add('active');
            link.setAttribute('aria-current','page');
          }
        });
      });

      var sectionMap = [
        ['#home', document.getElementById('home')],
        ['#menu', document.getElementById('menu')],
        ['#contatti', document.getElementById('contatti')]
      ].filter(function(pair){ return pair[1]; });

      if ('IntersectionObserver' in window && sectionMap.length) {
        var observer = new IntersectionObserver(function(entries){
          var visible = entries.filter(function(entry){ return entry.isIntersecting; })
                               .sort(function(a,b){ return b.intersectionRatio - a.intersectionRatio; })[0];
          if (visible) {
            var found = sectionMap.find(function(pair){ return pair[1] === visible.target; });
            if (found) setActiveByHash(found[0]);
          }
        }, {rootMargin: '-38% 0px -52% 0px', threshold: [0.08, 0.18, 0.35]});
        sectionMap.forEach(function(pair){ observer.observe(pair[1]); });
      }

      window.addEventListener('hashchange', function(){ setActiveByHash(location.hash); });
      setActiveByHash(location.hash || '#home');
    }
    initActiveNavbar();

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
