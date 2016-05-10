'use strict';

/*
 * New Age Bullshit Generator
 * © 2014-15 Seb Pearce (sebpearce.com)
 * Licensed under the MIT License.
 * ---
 * Adapted for use as a Node module by Charlton Trezevant - ctis.me

 * Mini-documentation:

 *    This module exposes the bs object itself (useful if you'd like to implement your own sentence generation rules)
 *    and a simple ionize method that returns a string with generated sentences.

 *    module.bs
 *		Various vocabulary/sentence patterns. The object is fairly self-explanatory so I won't go into much detail.
 *
 *    module.ionize(numberOfSentences, sentenceTopic):
 *		numberOfSentences - integer number of sentences to generate and return.
 * 		sentenceTopic - index of a sentence structure from bs.sentencePatterns. If not provided, the method will
 * 			select a topic at random.
 */

// Toolkit of useful functions
var kit = {

  copyArrayOfArrays: function copyArrayOfArrays(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      result[i] = arr[i].slice();
    }
    return result;
  },

  capitalizeFirstLetter: function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  randomInt: function randomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  }

};

// The generator in all its quantum glory
var bs = {

  sentencePool: [],

  initializeSentencePool: function initializeSentencePool() {
    this.sentencePool = [];
    this.sentencePool = kit.copyArrayOfArrays(this.sentencePatterns);
  },

  removeSentenceFromPool: function removeSentenceFromPool(topic, el) {
    if (el > -1) {
      this.sentencePool[topic].splice(el, 1);
    }
  },

  retrieveRandomWordOfType: function retrieveRandomWordOfType(type) {
    var rand = kit.randomInt(this.bullshitWords[type].length - 1);
    return this.bullshitWords[type][rand];
  },

  generateSentence: function generateSentence(topic) {

    var patternNumber = kit.randomInt(this.sentencePool[topic].length - 1);
    var pattern = this.sentencePool[topic][patternNumber];

    if (typeof pattern == 'undefined') {
      console.log('ran out of pattern ' + patternNumber);
    }

    // insert a space before . , ; ? so we can split the string into an array
    var pattern = pattern.replace(/([\.,;\?])/g, ' $1');
    var pattern = pattern.split(' ');

    // remove the pattern from the sentence pool so it can't be re-used
    this.removeSentenceFromPool(topic, patternNumber);

    // remove the topic from the sentence pool if there are no sentences left
    // for that particular topic
    if (this.sentencePool[topic].length === 0) {
      this.sentencePool.splice(topic, 1);
    }

    var result = '';
    for (var x in pattern) {
      // if word matches one of the placeholder words (e.g. nPerson),
      // replace it with a random instance of its type (e.g. warrior)
      if (this.bullshitWords.hasOwnProperty(pattern[x])) {
        result += this.retrieveRandomWordOfType(pattern[x]);
      } else {
        result += pattern[x];
      }
      result += ' ';
    }

    // replace 'a [vowel]' with 'an [vowel]'
    // I added a \W before the [Aa] because one time I got
    // 'Dogman is the antithesis of knowledge' :)
    result = result.replace(/(^|\W)([Aa]) ([aeiou])/g, '$1$2n $3');

    result = result.trim();
    result = kit.capitalizeFirstLetter(result);

    // remove spaces before commas/periods/semicolons
    result = result.replace(/ ([,\.;\?])/g, '$1');
    // take care of prefixes (delete the space after the hyphen)
    result = result.replace(/- /g, '-');
    // add space after question marks if they're mid-sentence
    result = result.replace(/\?(\w)/g, '? $1');

    return result;
  },

  generateText: function generateText(numberOfSentences, sentenceTopic) {

    var fullText = '';
    for (var i = 0; i < numberOfSentences; i++) {
      fullText += this.generateSentence(sentenceTopic);
      // if the topic has been deleted, pick another topic
      if (typeof this.sentencePool[sentenceTopic] == 'undefined') {
        sentenceTopic = kit.randomInt(this.sentencePool.length - 1);
      }
    }

    // insert a space between sentences (after periods and question marks)
    fullText = fullText.replace(/([\.\?])(\w)/g, '$1 $2');

    return fullText;
  }

};

/* vocab.js
 * Vocabulary words to be used in sentence patterns (patterns.js)
 */

bs.bullshitWords = {

  nCosmos: [
    'cosmos',
    'quantum soup',
    'infinite',
    'universe',
    'galaxy',
    'multiverse',
    'grid',
    'quantum matrix',
    'totality',
    'quantum cycle',
    'nexus',
    'planet',
    'solar system',
    'world',
    'stratosphere',
    'dreamscape',
    'biosphere',
  ],

  nPerson: [
    'being',
    'child',
    'traveller',
    'entity',
    'lifeform',
    'wanderer',
    'visitor',
    'prophet',
    'seeker',
  ],

  nPersonPlural: [
    'beings',
    'travellers',
    'entities',
    'lifeforms',
    'dreamweavers',
    'adventurers',
    'pilgrims',
    'warriors',
    'messengers',
    'dreamers',
    'storytellers',
    'seekers',
  ],

  nMass: [
    'consciousness',
    'nature',
    'beauty',
    'knowledge',
    'truth',
    'life',
    'healing',
    'potential',
    'freedom',
    'purpose',
    'coherence',
    'choice',
    'passion',
    'understanding',
    'balance',
    'growth',
    'inspiration',
    'conscious living',
    'energy',
    'health',
    'spacetime',
    'learning',
    'being',
    'wisdom',
    'stardust',
    'sharing',
    'science',
    'curiosity',
    'hope',
    'wonder',
    'faith',
    'fulfillment',
    'peace',
    'rebirth',
    'self-actualization',
    'presence',
    'power',
    'will',
    'flow',
    'potential',
    'potentiality',
    'chi',
    'intuition',
    'synchronicity',
    'wellbeing',
    'joy',
    'love',
    'karma',
    'life-force',
    'awareness',
    'guidance',
    'transformation',
    'grace',
    'divinity',
    'non-locality',
    'inseparability',
    'interconnectedness',
    'transcendence',
    'empathy',
    'insight',
    'rejuvenation',
    'ecstasy',
    'aspiration',
    'complexity',
    'serenity',
  ],

  nMassBad: [
    'turbulence',
    'pain',
    'suffering',
    'stagnation',
    'desire',
    'bondage',
    'greed',
    'selfishness',
    'ego',
    'dogma',
    'illusion',
    'delusion',
    'yearning',
    'discontinuity',
    'materialism',
  ],

  nOurPlural: [
    'souls',
    'lives',
    'dreams',
    'hopes',
    'bodies',
    'hearts',
    'brains',
    'third eyes',
    'essences',
    'chakras',
  ],

  nPath: [
    'circuit',
    'mission',
    'journey',
    'path',
    'quest',
    'vision quest',
    'story',
    'myth',
  ],

  nOf: [
    'quantum leap',
    'evolution',
    'spark',
    'lightning bolt',
    'reintegration',
    'vector',
    'rebirth',
    'revolution',
    'wellspring',
    'fount',
    'source',
    'fusion',
    'canopy',
    'flow',
    'network',
    'current',
    'transmission',
    'oasis',
    'quantum shift',
    'paradigm shift',
    'metamorphosis',
    'harmonizing',
    'reimagining',
    'rekindling',
    'unifying',
    'osmosis',
    'vision',
    'uprising',
    'explosion',
  ],

  ing: [
    'flowering',
    'unfolding',
    'blossoming',
    'awakening',
    'deepening',
    'refining',
    'maturing',
    'evolving',
    'summoning',
    'unveiling',
    'redefining',
    'condensing',
    'ennobling',
  ],

  adj: [
    'enlightened',
    'zero-point',
    'quantum',
    'high-frequency',
    'Vedic',
    'non-dual',
    'conscious',
    'sentient',
    'sacred',
    'infinite',
    'primordial',
    'ancient',
    'powerful',
    'spiritual',
    'higher',
    'advanced',
    'internal',
    'sublime',
    'technological',
    'dynamic',
    'life-affirming',
    'sensual',
    'unrestricted',
    'ever-present',
    'endless',
    'ethereal',
    'astral',
    'cosmic',
    'spatial',
    'transformative',
    'unified',
    'non-local',
    'mystical',
    'divine',
    'self-aware',
    'magical',
    'amazing',
    'interstellar',
    'unlimited',
    'authentic',
    'angelic',
    'karmic',
    'psychic',
    'pranic',
    'consciousness-expanding',
    'perennial',
    'heroic',
    'archetypal',
    'mythic',
    'intergalatic',
    'holistic',
    'joyous',
    'sublime',
  ],

  adjBig: [
    'epic',
    'unimaginable',
    'colossal',
    'unfathomable',
    'magnificent',
    'enormous',
    'jaw-dropping',
    'ecstatic',
    'powerful',
    'untold',
    'astonishing',
    'incredible',
    'breathtaking',
    'staggering',
  ],

  adjWith: [
    'aglow with',
    'buzzing with',
    'beaming with',
    'full of',
    'overflowing with',
    'radiating',
    'bursting with',
    'electrified with',
  ],

  adjPrefix: [
    'ultra-',
    'supra-',
    'hyper-',
    'pseudo-',
  ],

  vtMass: [
    'inspire',
    'integrate',
    'ignite',
    'discover',
    'rediscover',
    'foster',
    'release',
    'manifest',
    'harmonize',
    'engender',
    'bring forth',
    'bring about',
    'create',
    'spark',
    'reveal',
    'generate',
    'leverage',
  ],

  vtPerson: [
    'enlighten',
    'inspire',
    'empower',
    'unify',
    'strengthen',
    'recreate',
    'fulfill',
    'change',
    'develop',
    'heal',
    'awaken',
    'synergize',
    'ground',
    'bless',
    'beckon',
  ],

  viPerson: [
    'exist',
    'believe',
    'grow',
    'live',
    'dream',
    'reflect',
    'heal',
    'vibrate',
    'self-actualize',
  ],

  vtDestroy: [
    'destroy',
    'eliminate',
    'shatter',
    'disrupt',
    'sabotage',
    'exterminate',
    'obliterate',
    'eradicate',
    'extinguish',
    'erase',
    'confront',
  ],

  nTheXOf: [
    'richness',
    'truth',
    'growth',
    'nature',
    'healing',
    'knowledge',
  ],

  ppPerson: [
    'awakened',
    're-energized',
    'recreated',
    'reborn',
    'guided',
    'aligned',
  ],

  ppThingPrep: [
    'enveloped in',
    'transformed into',
    'nurtured by',
    'opened by',
    'immersed in',
    'engulfed in',
    'baptized in',
  ],

  fixedAdvP: [
    'through non-local interactions',
    'inherent in nature',
    'at the quantum level',
    'at the speed of light',
    'of unfathomable proportions',
    'on a cosmic scale',
    'devoid of self',
    'of the creative act',
  ],

  fixedAdvPPlace: [
    'in this dimension',
    'outside time',
    'within the Godhead',
    'at home in the cosmos',
  ],

  fixedNP: [
    'superpositions of possibilities',
    'electromagnetic forces',
    'electromagnetic resonance',
    'molecular structures',
    'atomic ionization',
    'electrical impulses',
    'a resonance cascade',
    'bio-electricity',
    'ultrasonic energy',
    'sonar energy',
    'vibrations',
    'frequencies',
    'four-dimensional superstructures',
    'ultra-sentient particles',
    'sub-atomic particles',
    'chaos-driven reactions',
    'supercharged electrons',
    'supercharged waveforms',
    'pulses',
    'transmissions',
    'morphogenetic fields',
    'bio-feedback',
    'meridians',
    'morphic resonance',
  ],

  nSubject: [
    'alternative medicine',
    'astrology',
    'tarot',
    'crystal healing',
    'the akashic record',
    'feng shui',
    'acupuncture',
    'homeopathy',
    'aromatherapy',
    'ayurvedic medicine',
    'faith healing',
    'prayer',
    'astral projection',
    'Kabala',
    'reiki',
    'naturopathy',
    'numerology',
    'affirmations',
    'the Law of Attraction',
  ],

  vOpenUp: [
    'open up',
    'give us access to',
    'enable us to access',
    'remove the barriers to',
    'clear a path toward',
    'let us access',
    'tap into',
    'align us with',
  ],

  vTraverse: [
    'traverse',
    'walk',
    'follow',
    'engage with',
    'go along',
    'roam',
    'navigate',
    'wander',
    'embark on',
  ],

};

/* patterns.js
 * A list of sentence patterns to be parsed by main.js
 */

 /*

 Available word types:

 - adj
 - adjBig
 - adjPrefix
 - adjWith
 - fixedAdvP
 - fixedAdvPPlace
 - fixedNP
 - ing
 - nCosmos
 - nMass
 - nMassBad
 - nOf
 - nOurPlural
 - nPath
 - nPerson
 - nPersonPlural
 - nSubject
 - nTheXOf
 - ppPerson
 - ppThingPrep
 - vOpenUp
 - vTraverse
 - viPerson
 - vtDestroy
 - vtMass
 - vtPerson

  */

bs.sentencePatterns = [

  // explaining
  [
    'nMass is the driver of nMass.',
    'nSubject will vtPerson our adj nOurPlural',
    'nMass is the nTheXOf of nMass, and of us.',
    'You and I are nPersonPlural of the nCosmos.',
    'We exist as fixedNP.',
    'We viPerson, we viPerson, we are reborn.',
    'This life is nothing short of a ing nOf of adj nMass.',
    'nSubject consists of fixedNP of nSubject.',
    'The goal of fixedNP is to plant the seeds of nMass rather than nMassBad.',
    'nMass is ppThingPrep nTheXOf.',
    'By ing, we viPerson.',
    'The nCosmos is adjWith fixedNP.',
    'To vTraverse the nPath is to become one with it.',
    'We must unite our nOurPlural to vOpenUp nMass.',
    'Today, science tells us that the essence of nature is nMass.',
    'nMass requires exploration.',
    'nSubject vOpenUp nMass.'
  ],

  // warnings
  [
    'We can no longer afford to live with nMassBad.',
    'Without nMass, one cannot viPerson.',
    'Only a nPerson of the nCosmos may vtMass this nOf of nMass.',
    'You must take a stand against nMassBad.',
    'Yes, it is possible to vtDestroy the things that can vtDestroy us, but not without nMass on our side.',
    'nMassBad is the antithesis of nMass.',
    'You may be ruled by nMassBad without realizing it. Do not let it vtDestroy the nTheXOf of your nPath.',
    'The complexity of the present time seems to demand a ing of our nOurPlural if we are going to survive.',
    'nMassBad is born in the gap where nMass has been ing.',
    'Where there is nMassBad, nMass cannot vtPerson.',
  ],

  // future hope
  [
    'Soon there will be a ing of nMass the likes of which the nCosmos has never seen.',
    'It is time to take nMass to the next level.',
    'Imagine a ing of what could be.',
    'Eons from now, we nPersonPlural will viPerson like never before as we are ppPerson by the nCosmos.',
    'The future will be a adj ing of nMass.',
    'This nPath never ends.',
    'We must learn how to lead adj lives in the face of nMassBad.',
    'We must vtPerson ourselves and vtPerson others.',
    'The nOf of nMass is now happening worldwide.',
    'We are being called by the nCosmos to vtMass nMass.',
    'It is in ing that we are ppPerson.',
    'The nCosmos is approaching a tipping point.',
  ],

  // you and your problems
  [
    'You are adj.',
    'nPerson, look within and vtPerson yourself.',
    'Will you vtMass your nPath to nMass?',
    'How will you vTraverse this adj nCosmos?',
    'How does one vtMass this nPath?',
    'If you have never experienced this nOf fixedAdvP, it can be difficult to viPerson.',
    'The nCosmos is calling to you via fixedNP.',
  ],

  // history
  [
    'Throughout history, humans have been interacting with the nCosmos via fixedNP.',
    'Reality has always been adjWith nPersonPlural whose nOurPlural are ppThingPrep nMass.',
    'Our conversations with other nPersonPlural have led to a ing of adjPrefix adj consciousness.',
    'We are in the midst of a adj ing of nMass that will vOpenUp the nCosmos itself.',
    'Where on the great nPath will we be ppPerson?',
    'nSubject must vOpenUp of nMass, rather than nMassBad.',
  ],

  // selling point
  [
    'Through nSubject, our nOurPlural are ppThingPrep nMass.',
    'nSubject may vtPerson adjBig nMass.',
    'As you viPerson, you will enter into infinite nMass that will vOpenUp fixedNP.',
  ],

];

function ionize(numberOfSentences, sentenceTopic) {
    bs.initializeSentencePool();

    // Topic can be specified manually, generated randomly by default.
    var sentenceTopic = sentenceTopic || kit.randomInt(bs.sentencePool.length - 1);

    return bs.generateText(numberOfSentences, sentenceTopic);
}

// Exports bs object and ionize method.
module.exports.bs = bs;
module.exports.ionize = ionize;
