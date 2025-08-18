const words = [
    'ad',
    'adipisicing',
    'aliqua',
    'aliquip',
    'amet',
    'anim',
    'aute',
    'cillum',
    'commodo',
    'consectetur',
    'consequat',
    'culpa',
    'cupidatat',
    'deserunt',
    'do',
    'dolor',
    'dolore',
    'duis',
    'ea',
    'eiusmod',
    'elit',
    'enim',
    'esse',
    'est',
    'et',
    'eu',
    'ex',
    'excepteur',
    'exercitation',
    'fugiat',
    'id',
    'in',
    'incididunt',
    'ipsum',
    'irure',
    'labore',
    'laboris',
    'laborum',
    'Lorem',
    'magna',
    'minim',
    'mollit',
    'nisi',
    'non',
    'nostrud',
    'nulla',
    'occaecat',
    'officia',
    'pariatur',
    'proident',
    'qui',
    'quis',
    'reprehenderit',
    'sint',
    'sit',
    'sunt',
    'tempor',
    'ullamco',
    'ut',
    'velit',
    'veniam',
    'voluptate',
];

export function createParagraph(wordCount: number, seed: number): string {
    if (wordCount <= 0) {
        return '';
    }

    const selectedWords: string[] = [];
    const baseSeed = Math.floor(seed * 982451653);

    for (let i = 0; i < wordCount; i++) {
        const wordSeed = (baseSeed + i * 2654435761) % Math.pow(2, 32);
        const randomIndex = Math.floor(
            (wordSeed / Math.pow(2, 32)) * words.length
        );
        selectedWords.push(words[randomIndex]);
    }

    // Capitalize first word and join with spaces
    if (selectedWords.length > 0) {
        selectedWords[0] =
            selectedWords[0].charAt(0).toUpperCase() +
            selectedWords[0].slice(1);
    }

    return selectedWords.join(' ') + '.';
}
