
        var tg = window.Telegram && window.Telegram.WebApp;
        var myUid = null;
        var ratingLoaded = false;
        var profileData = null;

        var ACH_MAP = {
          beginner:{name:'Начинающий талант',e:'🍀'},universes_10:{name:'10 вселенных',e:'🌈'},
          anime_10:{name:'10 аниме',e:'👻'},cartoons_10:{name:'10 мультфильмов',e:'🥺'},
          games_10:{name:'10 игр',e:'🎨'},heroes_10:{name:'10 про героев',e:'⚡'},
          romance_30:{name:'Сердцеедка',e:'💕'},comedy_30:{name:'Шутник',e:'🎆'},
          drama_30:{name:'Словила печальку',e:'😭'},horror_30:{name:'Бесстрашная',e:'🚨'},
          action_30:{name:'Доменик Торетто',e:'🤕'},referral_5:{name:'Пригласила 5',e:'😵'},
          referral_15:{name:'Пригласила 15',e:'😖'},referral_30:{name:'Пригласила 30',e:'🌪'},
        };

        var LEVELS=[{min:0,name:'НОВИЧОК'},{min:10,name:'НАЧИНАЮЩАЯ'},{min:25,name:'ТИГРИЦА'},
          {min:50,name:'MEDIUM-RARE'},{min:75,name:'НОРМИС'},{min:100,name:'МАСТЕР'},
          {min:150,name:'NERD'},{min:200,name:'ГУРУ'},{min:250,name:'СЕНСЕЙ'},{min:300,name:'ЧЕРНЫЙ ПОЯС'}];

        function getNextLevel(n){for(var i=0;i<LEVELS.length;i++){if(n<LEVELS[i].min)return LEVELS[i];}return null;}
        function getPrevLevelMin(n){var p=0;for(var i=0;i<LEVELS.length;i++){if(n<LEVELS[i].min)return p;p=LEVELS[i].min;}return p;}
        function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

        function showScreen(name){
          document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
          document.querySelectorAll('.nav-item:not(.locked)').forEach(function(n){n.classList.remove('active');});
          document.getElementById('screen-'+name).classList.add('active');
          var nav=document.getElementById('nav-'+name);
          if(nav)nav.classList.add('active');
          if(name==='rating'&&!ratingLoaded)loadRating();
        }

        function handleFanficAction(action){
          if(!myUid)return;
          if(profileData&&profileData.can_generate===false){
            showScreen('subs');
            document.getElementById('subs-limit-notice').innerHTML='<div class="subs-limit-notice"><strong>Бесплатные генерации закончились</strong>Оформи подписку чтобы продолжить без ограничений.</div>';
            return;
          }
          fetch('/api/wf/action?uid='+myUid+'&action='+action).then(function(){if(tg)tg.close();});
        }

        async function buyPlan(planId){
          if(!myUid)return;
          try{
            var r=await fetch('/api/wf/action?uid='+myUid+'&action=buy_'+planId);
            var d=await r.json();
            if(d.url){if(tg){tg.openLink(d.url);}else{window.open(d.url,'_blank');}}
          }catch(e){alert('Ошибка создания платежа, попробуй позже');}
        }

        async function initApp() {
          tg = window.Telegram && window.Telegram.WebApp;
          if (tg) { tg.ready(); tg.expand(); }
        
          await new Promise(function(r) { setTimeout(r, 200); });
        
          tg = window.Telegram && window.Telegram.WebApp;
        
          try {
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
              myUid = String(tg.initDataUnsafe.user.id);
            } else {
              myUid = new URLSearchParams(location.search).get('uid');
            }
            if (!myUid) { showError('Открой через Telegram бот'); return; }
            var r = await fetch('/api/wf/profile?uid=' + myUid + '&init=' + encodeURIComponent((tg && tg.initData) || ''));
            if (!r.ok) throw new Error('failed');
            var d = await r.json();
            profileData = d;
            renderProfile(d);
          } catch(e) { showError('Ошибка загрузки'); }
          finally { document.getElementById('loading').classList.add('hidden'); }
        }

        async function loadProfile(){
          try{
            var uid=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;
            if(!uid)uid=new URLSearchParams(window.location.search).get('uid');
            if(!uid){showError('Открой через Telegram бот');return;}
            myUid=uid;
            var r=await fetch('/api/wf/profile?uid='+uid+'&init='+encodeURIComponent((tg&&tg.initData)||''));
            if(!r.ok)throw new Error('failed');
            var d=await r.json();
            profileData=d;
            renderProfile(d);
          }catch(e){showError('Ошибка загрузки');}
          finally{document.getElementById('loading').classList.add('hidden');}
        }

        function renderProfile(d){
          document.getElementById('prof-name').textContent=d.name||'Пользователь';
          document.getElementById('prof-level').textContent=d.level||'НОВИЧОК';
          var fanfics=d.total_fanfics||0;
          var next=getNextLevel(fanfics);
          var prevMin=getPrevLevelMin(fanfics);
          if(next){
            document.getElementById('prof-progress').style.width=Math.round((fanfics-prevMin)/(next.min-prevMin)*100)+'%';
            document.getElementById('prof-progress-hint').textContent='До '+next.name+' — ещё '+(next.min-fanfics)+' фанфиков';
          }else{
            document.getElementById('prof-progress').style.width='100%';
            document.getElementById('prof-progress-hint').textContent='Максимальный уровень';
          }
          var subEl=document.getElementById('prof-sub');
          if(d.unlimited_until&&Date.now()<d.unlimited_until){
            var till=new Date(d.unlimited_until).toLocaleDateString('ru',{day:'numeric',month:'long'});
            subEl.innerHTML='<div class="sub-badge">👑 Подписка до '+till+'</div>';
          }else{
            subEl.innerHTML='<div class="sub-badge inactive">Бесплатный тариф</div>';
          }
          var achs=d.achievements||[];
          document.getElementById('stat-fanfics').textContent=fanfics;
          document.getElementById('stat-achs').textContent=achs.length;
          document.getElementById('stat-refs').textContent=d.referrals_count||0;
          var earnedHtml='',lockedHtml='';
          Object.keys(ACH_MAP).forEach(function(key){
            var a=ACH_MAP[key];
            if(achs.indexOf(key)!==-1){earnedHtml+='<div class="ach-chip earned">'+a.e+' '+a.name+'</div>';}
            else{lockedHtml+='<div class="ach-chip locked-ach">🔒 '+a.name+'</div>';}
          });
          var html='';
          if(!earnedHtml)html+='<div class="ach-empty">Пока нет достижений — создай первый фанфик!</div>';
          else html+=earnedHtml;
          if(lockedHtml)html+='<div class="ach-divider"></div><div class="ach-locked-label">Ещё не получены</div>'+lockedHtml;
          document.getElementById('ach-grid').innerHTML=html;
        }

        async function loadRating(){
          var listEl=document.getElementById('rating-list');
          var myPlaceEl=document.getElementById('rating-myplace');
          try{
            var r=await fetch('/api/wf/rating'+(myUid?'?uid='+myUid:''));
            if(!r.ok)throw new Error();
            var d=await r.json();
            ratingLoaded=true;
            var html='';
            for(var i=0;i<d.top.length;i++){
              var u=d.top[i];
              var rankText=i===0?'🥇':i===1?'🥈':i===2?'🥉':String(i+1);
              var isMe=u.uid===String(myUid);
              var score=Math.round(u.score||0);
              html+='<div class="rating-item'+(isMe?' me':'')+'" style="animation-delay:'+(i*0.05)+'s">';
              html+='<div class="rating-rank">'+rankText+'</div>';
              html+='<div class="rating-name">'+esc(u.name)+(isMe?' <span class="rating-me-badge">ТЫ</span>':'')+' </div>';
              html+='<div class="rating-score">'+score+' оч.</div>';
              html+='</div>';
            }
            listEl.innerHTML=html;
            var inTop=d.top.some(function(u){return u.uid===String(myUid);});
            if(!inTop&&d.my_place){
              myPlaceEl.innerHTML='<div class="rating-myplace">Твоё место<strong>#'+d.my_place+'</strong><span style="color:var(--muted);font-size:12px">'+Math.round(d.my_score||0)+' оч.</span></div>';
            }
          }catch(e){
            listEl.innerHTML='<div style="color:var(--muted);font-size:13px;padding:20px 0">Не удалось загрузить</div>';
          }
        }

        function showError(msg){document.getElementById('loading').classList.add('hidden');document.getElementById('prof-name').textContent=msg;}

        window.showScreen = showScreen;
        window.handleFanficAction = handleFanficAction;
        window.buyPlan = buyPlan;
        window.initApp = initApp;
