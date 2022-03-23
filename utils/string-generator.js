const getRandomCode = (length, onlyCaps=false) => {
  let result = '';
  let characters = "";
  if (!onlyCaps){
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }else{
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

module.exports = getRandomCode;