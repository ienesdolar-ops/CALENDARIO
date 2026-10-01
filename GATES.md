# GATES — Instagram Profile Simulator for Faculdade Inspirar BC (Amplesoft & Direct CTA)

## G1 — File structure, Amplesoft font and carousel slide assets exist
All 6 carousel slides, AmpleSoft font and core app files exist:
  CHECK: node -e "const fs=require('fs');const files=['index.html','style.css','app.js','posts.js','assets/profile.png','assets/fonts/AmpleSoftPro.ttf','assets/pelvica_slide1.jpg','assets/pelvica_slide2.jpg','assets/pelvica_slide3.jpg','assets/pelvica_slide4.jpg','assets/pelvica_slide5.jpg','assets/pelvica_slide6.jpg'];const ok=files.every(f=>fs.existsSync(f));console.log(ok?'FILES_OK':'FILES_MISSING');process.exit(ok?0:1)"
  EXPECT: FILES_OK

## G2 — posts.js contains the Fisioterapia Pélvica carousel without comment automation
posts.js has post 1 with 6 slides, and does NOT ask users to comment keywords:
  CHECK: node -e "const p=require('./posts.js');const post=p.find(x=>x.id===1);const ok=Array.isArray(p)&&post&&post.tipo==='carrossel'&&post.midias.length===6&&post.legenda.includes('FISIOTERAPIA PÉLVICA')&&!post.legenda.toLowerCase().includes('comente')&&!post.comentarios.some(c=>c.texto==='PÉLVICA');console.log(ok?'POST_PELVICA_OK':'POST_PELVICA_INVALID');process.exit(ok?0:1)"
  EXPECT: POST_PELVICA_OK

## G3 — HTML is valid and contains profile & modal elements
index.html contains profile-header, post-grid, post-modal, and highlights:
  CHECK: node -e "const h=require('fs').readFileSync('index.html','utf8');const checks=['profile-header','post-grid','post-modal','highlights-container','theme-toggle'];const ok=checks.every(c=>h.includes(c));console.log(ok?'HTML_OK':'HTML_MISSING');process.exit(ok?0:1)"
  EXPECT: HTML_OK

## G4 — CSS includes Amplesoft font-face
style.css defines AmpleSoftPro font-face and is at least 3000 bytes:
  CHECK: node -e "const fs=require('fs');const s=fs.statSync('style.css').size;const css=fs.readFileSync('style.css','utf8');const ok=s>=3000&&css.includes('AmpleSoftPro');console.log(ok?'CSS_OK':'CSS_FAIL');process.exit(ok?0:1)"
  EXPECT: CSS_OK

## G5 — app.js is valid and non-trivial
app.js is at least 5000 bytes:
  CHECK: node -e "const s=require('fs').statSync('app.js').size;const ok=s>=5000;console.log(ok?'JS_OK':'JS_TOO_SMALL('+s+')');process.exit(ok?0:1)"
  EXPECT: JS_OK

## G6 — All 6 carousel slide files are valid high-res images
Each of the 6 slide images is at least 200KB:
  CHECK: node -e "const fs=require('fs');const ok=[1,2,3,4,5,6].every(i=>fs.statSync('assets/pelvica_slide'+i+'.jpg').size>200000);console.log(ok?'SLIDES_RES_OK':'SLIDES_RES_LOW');process.exit(ok?0:1)"
  EXPECT: SLIDES_RES_OK

## G7 — No syntax errors in JS files
All JS files parse cleanly:
  CHECK: node -e "try{require('./posts.js');new Function(require('fs').readFileSync('app.js','utf8'));console.log('SYNTAX_OK')}catch(e){console.log('SYNTAX_ERROR:'+e.message);process.exit(1)}"
  EXPECT: SYNTAX_OK
