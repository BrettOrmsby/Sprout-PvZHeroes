import * as fs from 'fs'
import createStats from './createStats.ts'
import createGraphs from './createGraphs.ts'
import createBestWorst from './createBestWorst.ts'

const stats = createStats()
const graphs = createGraphs(stats)
const bestWorst = createBestWorst(stats)

const dataSummary = {
  completedDecks: stats.completedDecks,
  sparks: stats.sparks,
  plantDecks: stats.plantDecks,
  zombieDecks: stats.zombieDecks,
  graphs,
  bestWorst,
}

fs.writeFile('./data-summary/datasummary.json', JSON.stringify(dataSummary), (err) => {
  if (err) throw err
  console.log('Data Summary saved.')
})

// node --experimental-strip-types ./data-summary/main.ts
