import TrieNode from './trie-node.js';

export default class Trie {
  constructor() {
    this.root = new TrieNode();
    this.cursor = this.root;
  }

  insert(word) {
    if (this.root.words.has(word)) return;

    for (const letter of word) {
      let childNode;
      const lowercaseLetter = letter.toLowerCase();

      if (this.cursor.children.has(lowercaseLetter)) {
        childNode = this.cursor.children.get(lowercaseLetter);
      } else {
        childNode = new TrieNode(lowercaseLetter);
        this.cursor.children.set(lowercaseLetter, childNode);
      }

      this.cursor.words.add(word);
      this.cursor = childNode;
    }
    this.cursor.words.add(word);
    this.reset();
  }

  insertMany(words) {
    for (const word of words) {
      this.insert(word);
    }
  }

  search(ch) {
    const lowercaseChar = ch.toLowerCase();
    if (this.cursor.children.has(lowercaseChar)) {
      this.cursor = this.cursor.children.get(lowercaseChar);
      const { words } = this.cursor;
      this.reset();
      return Array.from(words);
    }
    this.reset();
    return null;
  }

  searchPhrase(phrase) {
    const lowercasePhrase = phrase.toLowerCase();
    for (const ch of lowercasePhrase) {
      if (this.cursor.children.has(ch)) {
        this.cursor = this.cursor.children.get(ch);
      } else {
        this.reset();
        return null;
      }
    }

    const { words } = this.cursor;
    this.reset();
    return Array.from(words);
  }

  reset() {
    this.cursor = this.root;
  }
}
