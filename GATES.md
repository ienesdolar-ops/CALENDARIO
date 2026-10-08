# Gates: Configuração e Otimização para Deploy na Vercel

OWNS: package.json, vercel.json, GATES.md

Scope: Configurar o projeto para deploy estático na Vercel sem falhas de build e com compatibilidade total.

- [ ] G1: package.json possui script de build seguro para compatibilidade com a Vercel
  CHECK: node -e "const p=require('./package.json');const ok=p.scripts&&p.scripts.build&&p.scripts.build.includes('ready');console.log(ok?'BUILD_SCRIPT_OK':'NO_BUILD_SCRIPT');process.exit(ok?0:1)"
  EXPECT: BUILD_SCRIPT_OK
  EVIDENCE: pending

- [ ] G2: vercel.json configurado para deploy estatico direto na raiz
  CHECK: node -e "const fs=require('fs');const ok=fs.existsSync('vercel.json');console.log(ok?'VERCEL_CONFIG_OK':'NO_VERCEL_CONFIG');process.exit(ok?0:1)"
  EXPECT: VERCEL_CONFIG_OK
  EVIDENCE: pending

- [x] G3: Todos os arquivos da aplicacao web permanecem integros
  CHECK: node -e "const fs=require('fs');const ok=fs.existsSync('index.html')&&fs.existsSync('style.css')&&fs.existsSync('app.js')&&fs.existsSync('posts.js');console.log(ok?'WEB_FILES_OK':'WEB_FILES_FAIL');process.exit(ok?0:1)"
  EXPECT: WEB_FILES_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\calendario; path=20306c96c5ba/24 entries; EXPECT=matched; output-sha256=3161ed3e2082d1d5f8836e046b6232264663fc5ab8a3f12e5e5c14b5619caac5; output-bytes=13

- [ ] G4: Repositorio sincronizado com commit e push no GitHub
  CHECK: node -e "const {execSync}=require('child_process');const status=execSync('git status --porcelain').toString();console.log(status.trim()===''?'GIT_SYNCED_OK':'GIT_DIRTY');process.exit(status.trim()===''?0:1)"
  EXPECT: GIT_SYNCED_OK
  EVIDENCE: pending
