export default function convertToEnglish(str: string): string {
    const charMap: {[key: string]: string} = {
      'ä': 'ae',
      'ö': 'oe',
      'ü': 'ue',
      'ß': 'ss',
      'é': 'e',
      'è': 'e',
      'ê': 'e',
      'ë': 'e',
      'á': 'a',
      'à': 'a',
      'â': 'a',
      'ã': 'a',
      'å': 'a',
      'ç': 'c',
      'í': 'i',
      'ì': 'i',
      'î': 'i',
      'ï': 'i',
      'ñ': 'n',
      'ó': 'o',
      'ò': 'o',
      'ô': 'o',
      'õ': 'o',
      'ø': 'o',
      'ú': 'u',
      'ù': 'u',
      'û': 'u',
      'æ': 'ae',
      'œ': 'oe',
      'й': 'i',
      'ё': 'e',
      'ж': 'zh',
      'х': 'kh',
      'ц': 'ts',
      'ч': 'ch',
      'ш': 'sh',
      'щ': 'shch',
      'ъ': '',
      'ы': 'y',
      'ь': '',
      'э': 'e',
      'ю': 'yu',
      'я': 'ya'
    };
  
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, (match: string) => charMap[match] || '');
  }