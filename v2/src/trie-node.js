export default class TrieNode {
  constructor(letter = null) {
    this.letter = letter;
    this.children = new Map(); // letter: TrieNode
    this.words = new Set();
  }
}
