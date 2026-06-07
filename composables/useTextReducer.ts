
export const useTextReducer = () => {
  const reduceParagraph = (
    text: string,
    targetWordCount: number,
    options: {
      addEllipsis?: boolean;
      preserveLastSentence?: boolean;
    } = {}
  ): string => {
    const { addEllipsis = true, preserveLastSentence = false } = options;
    const words = text.trim().split(/\s+/);

    if (words.length <= targetWordCount) {
      return text;
    }

    let reducedWords = words.slice(0, targetWordCount);

    if (preserveLastSentence && targetWordCount > 0) {
      const reducedText = reducedWords.join(' ');
      const lastPeriod = reducedText.lastIndexOf('.');
      const lastExclamation = reducedText.lastIndexOf('!');
      const lastQuestion = reducedText.lastIndexOf('?');
      
      const lastPunctuation = Math.max(lastPeriod, lastExclamation, lastQuestion);
      
      if (lastPunctuation > 0) {
        return reducedText.substring(0, lastPunctuation + 1);
      }
    }

    let result = reducedWords.join(' ');

    if (addEllipsis) {
      result = result.replace(/[.,;:!?]$/, '') + '...';
    }
console.log(result);

    return result;
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return {
    reduceParagraph,
    getWordCount
  };
};