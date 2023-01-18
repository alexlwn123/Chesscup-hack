// var targetObj = {};
// var targetProxy = new Proxy(targetObj, {
//   set: function (target, key, value) {
//       console.log(`${key} set to ${value}`);
//       target[key] = value;
//       return true;
//   }
// })

cheaty = function(){
  if ($r.state.moves.length === 0) return;
  let movess = $r.state.moves[0];
  for (let i = 0; i < movess.length; i++) {
      if (i % 2 == 0) console.log(movess[i]);
  }
  console.log('\n')
}

function logKey(e) {
  if (e.code === "KeyA") {
    cheaty()
  }
}
window.addEventListener('keypress', logKey);
