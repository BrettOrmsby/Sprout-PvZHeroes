import * as fs from 'fs'
import { type Stats } from './createStats.ts'
import { getHero, isPlant } from './utils.ts'
import type { DeckGraphCollection, Graph } from '../src/lib/types.ts'

const useHeroColour = false

export default function createGraphs(stats: Stats): DeckGraphCollection {
  const graphs: DeckGraphCollection = {
    heroes: {
      plants: newGraph('bar'),
      zombies: newGraph('bar'),
      all: newGraph('bar'),
    },
    classes: {
      plants: newGraph('bar'),
      zombies: newGraph('bar'),
      all: newGraph('bar'),
      cardUsage: newGraph('bar'),
    },
    rarity: newGraph('bar'),
    curve: newGraph('bar'),
    types: newGraph('bar'),
  }
  createHeroes(stats, graphs)
  createClasses(stats, graphs)
  createRarity(stats, graphs)
  createCurve(stats, graphs)
  createTypes(stats, graphs)

  fs.writeFile('./data-summary/graphs.json', JSON.stringify(graphs), (err) => {
    if (err) throw err
    console.log('Graphs saved.')
  })

  return graphs
}

function newGraph(type: 'doughnut' | 'bar'): Graph {
  return {
    type,
    data: {},
    options: {},
  }
}

function sortEntries(obj: Record<string, number>): { keys: string[]; values: number[] } {
  const sortedObj = Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]))
  return {
    keys: Object.keys(sortedObj),
    values: Object.values(sortedObj),
  }
}

function createHeroes(stats: Stats, graphs: DeckGraphCollection) {
  const { keys: sortedHeroes, values: sortedHeroValues } = sortEntries(stats.heroDecks)

  const heroColours: Record<string, string> = {
    'Beta-Carrotina': '#CCC6B4',
    'Huge-Gigantacus': '#5B2D9C',
    Citron: '#F8A283',
    Nightcap: '#E7B6EE',
    'Brain Freeze': '#0172AD',
    'Super Brainz': '#4D1A57',
    'The Smash': '#BF6E00',
    'Electric Boogaloo': '#1D59D0',
    'Z-Mech': '#E74B1A',
    Rose: '#E8D600',
    Spudow: '#F06048',
    'Professor Brainstorm': '#6935B3',
    'Grass Knuckles': '#265E09',
    Immorticia: '#C1208B',
    Impfinity: '#3F1E6D',
    'Captain Combustible': '#D93526',
    Neptuna: '#942D0D',
    'Wall-Knight': '#A77C00',
    Rustbolt: '#CD68E0',
    Chompzilla: '#77EF3D',
    'Solar Flare': '#FF9500',
    'Green Shadow': '#55C21E',
  }
  const defaultOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        title: {
          text: 'Decks',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  graphs.heroes.all.data = {
    labels: sortedHeroes,
    datasets: [
      {
        label: 'Decks',
        data: sortedHeroValues,
        backgroundColor: useHeroColour ? sortedHeroes.map((name) => heroColours[name]) : '#6366f1',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.heroes.all.options = defaultOptions

  const sortedZombieHeroes = []
  const sortedPlantHeroes = []
  const sortedZombieHeroValues = []
  const sortedPlantHeroValues = []
  for (let i = 0; i < sortedHeroes.length; i++) {
    if (isPlant(getHero(sortedHeroes[i]).class[0])) {
      sortedPlantHeroes.push(sortedHeroes[i])
      sortedPlantHeroValues.push(sortedHeroValues[i])
    } else {
      sortedZombieHeroes.push(sortedHeroes[i])
      sortedZombieHeroValues.push(sortedHeroValues[i])
    }
  }

  graphs.heroes.plants.data = {
    labels: sortedPlantHeroes,
    datasets: [
      {
        label: 'Decks',
        data: sortedPlantHeroValues,
        backgroundColor: useHeroColour
          ? sortedPlantHeroes.map((name) => heroColours[name])
          : '#6366f1',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.heroes.plants.options = defaultOptions

  graphs.heroes.zombies.data = {
    labels: sortedZombieHeroes,
    datasets: [
      {
        label: 'Decks',
        data: sortedZombieHeroValues,
        backgroundColor: useHeroColour
          ? sortedZombieHeroes.map((name) => heroColours[name])
          : '#6366f1',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.heroes.zombies.options = defaultOptions
}

function createClasses(stats: Stats, graphs: DeckGraphCollection) {
  const { keys: sortedClasses, values: sortedClassValues } = sortEntries(stats.classDecks)

  const classColours: Record<string, string> = {
    Guardian: '#492F1C',
    Kabloom: '#A03732',
    'Mega-Grow': '#64A65B',
    Smarty: '#A3A2A4',
    Solar: '#D6D848',

    Beastly: '#4771A6',
    Brainy: '#91398D',
    Crazy: '#6331B9',
    Hearty: '#9B762C',
    Sneaky: '#3A3939',
  }

  const defaultOptions = {
    scales: {
      y: {
        title: {
          text: 'Decks',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  graphs.classes.all.data = {
    labels: sortedClasses,
    datasets: [
      {
        label: 'Decks',
        data: sortedClassValues,
        backgroundColor: sortedClasses.map((name) => classColours[name]),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.classes.all.options = defaultOptions

  const sortedZombieClasses = []
  const sortedPlantClasses = []
  const sortedZombieClassValues = []
  const sortedPlantClassValues = []
  for (let i = 0; i < sortedClasses.length; i++) {
    if (isPlant(sortedClasses[i])) {
      sortedPlantClasses.push(sortedClasses[i])
      sortedPlantClassValues.push(sortedClassValues[i])
    } else {
      sortedZombieClasses.push(sortedClasses[i])
      sortedZombieClassValues.push(sortedClassValues[i])
    }
  }

  graphs.classes.plants.data = {
    labels: sortedPlantClasses,
    datasets: [
      {
        label: 'Decks',
        data: sortedPlantClassValues,
        backgroundColor: sortedPlantClasses.map((name) => classColours[name]),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.classes.plants.options = defaultOptions

  graphs.classes.zombies.data = {
    labels: sortedZombieClasses,
    datasets: [
      {
        label: 'Decks',
        data: sortedZombieClassValues,
        backgroundColor: sortedZombieClasses.map((name) => classColours[name]),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.classes.zombies.options = defaultOptions

  const { keys: sortedCardUsageClass, values: sortedCardUsage } = sortEntries(
    Object.fromEntries(
      Object.entries(stats.sumCardClasses).map(([className, usage]) => [
        className,
        usage / stats.classDecks[className],
      ]),
    ),
  )
  graphs.classes.cardUsage.data = {
    labels: sortedCardUsageClass,
    datasets: [
      {
        label: 'Number of Cards',
        data: sortedCardUsage,
        backgroundColor: sortedCardUsageClass.map((name) => classColours[name]),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.classes.cardUsage.options = {
    indexAxis: 'y',
    scales: {
      x: {
        title: {
          text: 'Average Number of Cards Used',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }
}

function createRarity(stats: Stats, graphs: DeckGraphCollection) {
  const { keys: sortedRarities, values: sortedRarityValues } = sortEntries(stats.sumRarity)

  const rarityGraphStyles: Record<string, { label: string; colour: string }> = {
    common: { label: 'Common', colour: '#f5f5dc' },
    uncommon: { label: 'Uncommon', colour: '#959a9d' },
    rare: { label: 'Rare', colour: '#ea9c45' },
    'super-rare': { label: 'Super-Rare', colour: '#885cd5' },
    legendary: { label: 'Legendary', colour: '#ddcb25ff' },
    event: { label: 'Event', colour: '#e66d59' },
  }

  graphs.rarity.data = {
    labels: sortedRarities.map((rarity) => rarityGraphStyles[rarity].label),
    datasets: [
      {
        label: 'Number of Cards',
        data: sortedRarityValues.map((number) => number / stats.completedDecks),
        backgroundColor: sortedRarities.map((rarity) => rarityGraphStyles[rarity].colour),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.rarity.options = {
    scales: {
      y: {
        title: {
          text: 'Average Number of Cards in a Deck',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }
}

function createCurve(stats: Stats, graphs: DeckGraphCollection) {
  graphs.curve.data = {
    labels: Object.keys(stats.sumCosts),
    datasets: [
      {
        label: 'Number of Cards',
        data: Object.values(stats.sumCosts).map((number) => number / stats.completedDecks),
        backgroundColor: '#6366f1',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
  graphs.curve.options = {
    scales: {
      y: {
        title: {
          text: 'Average Number of Cards in a Deck',
          display: true,
          //color: graphColours.value.muted,
        },
      },
      x: {
        title: {
          text: 'Card Cost',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }
}

function createTypes(stats: Stats, graphs: DeckGraphCollection) {
  graphs.types.data = {
    labels: ['Fighter', 'Trick', 'Environment'],
    datasets: [
      {
        label: 'Plants',
        data: [
          stats.sumPlantTypes.Plant,
          stats.sumPlantTypes.Trick,
          stats.sumPlantTypes.Environment,
        ].map((number) => number / stats.plantDecks),
        backgroundColor: '#64A65B',
        borderColor: 'black',
        borderWidth: 1,
      },
      {
        label: 'Zombies',
        data: [
          stats.sumZombieTypes.Zombie,
          stats.sumZombieTypes.Trick,
          stats.sumZombieTypes.Environment,
        ].map((number) => number / stats.zombieDecks),
        backgroundColor: '#91398D',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }

  graphs.types.options = {
    scales: {
      y: {
        title: {
          text: 'Average Number of Cards in a Deck',
          display: true,
          //color: graphColours.value.muted,
        },
      },
      x: {
        title: {
          text: 'Card Type',
          display: true,
          //color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
}
