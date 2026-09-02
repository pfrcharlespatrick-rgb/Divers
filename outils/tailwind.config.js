module.exports = {
  content: [
    '../mouches-saumon/index.html',
    '../mouches-saumon/assets/js/*.js'
  ],
  theme: {
    extend: {
      colors: {
        riviere: { 50:'#f4f7f6',100:'#e3ebe8',200:'#c6d7d2',300:'#9bb8b1',400:'#6b938b',500:'#4b756e',600:'#395d58',700:'#2f4a47',800:'#283c3a',900:'#1d2b2a',950:'#111c1b' },
        cuivre:  { 100:'#fbeade',300:'#eab189',500:'#c9743a',600:'#ac5c2b',700:'#8b4823' },
        sable:   { 50:'#faf7f1',100:'#f2ebdd',200:'#e4d7bf',300:'#cdb894' }
      },
      fontFamily: {
        titre: ['"Iowan Old Style"','"Palatino Linotype"','Palatino','Georgia','serif'],
        texte: ['ui-sans-serif','system-ui','-apple-system','"Segoe UI"','Roboto','sans-serif']
      }
    }
  }
}
