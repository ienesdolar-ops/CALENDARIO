# Gates: Adiantamento dos Conteúdos em 1 Semana e Preparação para o GitHub

OWNS: posts.js, app.js, GATES.md

Scope: Adiantar as postagens em uma semana (para 09/10, 16/10, 23/10 e 30/10), manter a ordenação decrescente no feed do Instagram e preparar o repositório git para commit e push no GitHub.

- [x] G1: Postagens de outubro adiantadas em uma semana para as datas 09/10, 16/10, 23/10 e 30/10
  CHECK: node -e "const p=require('./posts.js');const fridays=['2026-10-09','2026-10-16','2026-10-23','2026-10-30'];const hasAll=fridays.every(f=>p.some(post=>post.data===f));console.log(hasAll?'DATES_SHIFTED_OK':'DATES_FAIL');process.exit(hasAll?0:1)"
  EXPECT: DATES_SHIFTED_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=2f220c00c41273506d5285c3b82baba2a3fe3bcc3ad8c92328d3bccabcd50091; output-bytes=17

- [x] G2: Nao ha posts agendados na data antiga de 02/10/2026
  CHECK: node -e "const p=require('./posts.js');const hasOct2=p.some(post=>post.data==='2026-10-02');console.log(!hasOct2?'NO_OCT2_OK':'OCT2_STILL_PRESENT');process.exit(!hasOct2?0:1)"
  EXPECT: NO_OCT2_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=319297b175324f607c0eef0a39f5314259d030a99b71d5a517f03acd7472df93; output-bytes=11

- [x] G3: Feed exibe os posts em ordem cronologica decrescente (30/10 no topo e 09/10 no final)
  CHECK: node -e "const p=require('./posts.js');const fs=require('fs');const app=fs.readFileSync('app.js','utf8');const ok=app.includes('b.data')&&p[0].data==='2026-10-30'&&p[p.length-1].data==='2026-10-09';console.log(ok?'ORDER_OK':'ORDER_FAIL');process.exit(ok?0:1)"
  EXPECT: ORDER_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=8dba7477e5fc23960cbf721526ebf8275f26a05d7693c7b1b9d54279647f0689; output-bytes=9

- [x] G4: Arquivos JS executam e compilam sem erros de sintaxe
  CHECK: node -e "try{require('./posts.js');new Function(require('fs').readFileSync('app.js','utf8'));console.log('SYNTAX_OK')}catch(e){console.log('SYNTAX_ERROR:'+e.message);process.exit(1)}"
  EXPECT: SYNTAX_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=998ccf616845fbd499cb9af01f47e877a7b5e6c6982e4098016424acaf9182d1; output-bytes=10

- [x] G5: Todos os arquivos necessarios estao prontos para commit no repositorio git
  CHECK: node -e "const fs=require('fs');const ok=fs.existsSync('posts.js')&&fs.existsSync('app.js')&&fs.existsSync('index.html')&&fs.existsSync('assets/outubro/1.png');console.log(ok?'FILES_READY_OK':'FILES_MISSING');process.exit(ok?0:1)"
  EXPECT: FILES_READY_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=3bcc5f7bb8fb91a162596801a02022ba49eae34b64e54868f7443ce228bc4c66; output-bytes=15
