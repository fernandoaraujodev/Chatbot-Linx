const Filter = require('bad-words');

const Moderation = (text) => {
    var filter = new Filter({ list: [
      //palavras inapropriadas
      'puta', 'puto', 'pqp', 'putiane', 'prostituta', 'prostituto', 'meretriz',
      'vagabundo', 'vagabunda', 'vagaba',
      'cuzao', 'cuzão', 'cuzona',
      'mongo', 'mongona', 'mongolóide', 'mongão',
      'otario', 'otaria',
      'babaca', 'imbecil', 'imprestavel', 'imprestável',
      'vsf', 'fds', 'foda',
      'cu', 'bct', 'buceta',
      'porra', 'carai', 'caralho', 'krl',
      'cu', 'vtmnc', 'vai tnc', 'tnc', 'arrombado', 'arrombadinho', 'fdp', 'merda',
    ] });

    if (filter.isProfane(text)) {

      console.log('comportamento inadequado')
      return false
    }

    return true
}

export default Moderation;
