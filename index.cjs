const {digg} = require("@kaspernj/object-digger")
const fs = require("fs").promises

class CountUploadsAndMoves {
  constructor() {
    this.movesCount = 0
    this.uploadsCount = 0
  }

  async scanLogs() {
    const files = await fs.readdir("./logs")

    console.log({files})

    for (const file of files) {
      await this.scanLog(file)
    }
  }

  async scanLog(file) {
    console.log("scanLog", {file})

    const contentBuffer = await fs.readFile(`./logs/${file}`)
    const content = `${contentBuffer}`

    console.log("singleUploadsCount", {file})
    this.uploadsCount += this.singleUploadsCount(content)

    console.log("multipleUploadsCount", {file})
    this.uploadsCount += this.multipleUploadsCount(content)

    console.log("singleMovesCount", {file})
    this.movesCount += this.singleMovesCount(content)

    console.log("multipleMovesCount", {file})
    this.movesCount += this.multipleMovesCount(content)
  }

  singleUploadsCount(content) {
    const matches = [...content.matchAll(/You uploaded an item/g)]
    const count = digg(matches, "length")

    return count
  }

  multipleUploadsCount(content) {
    const matches = content.matchAll(/You uploaded (\d+) items/g)

    let count = 0

    for (const match of matches) {
      const uploadCount = parseInt(match[1])

      count += uploadCount
    }

    return count
  }

  singleMovesCount(content) {
    const matches = [...content.matchAll(/You renamed an item/g)]
    const count = digg(matches, "length")

    return count
  }

  multipleMovesCount(content) {
    const matches = content.matchAll(/You moved (\d+) items/g)

    let count = 0

    for (const match of matches) {
      const movedCount = parseInt(match[1])

      count += movedCount
    }

    return count
  }
}

const countUploadsAndMoves = new CountUploadsAndMoves()

countUploadsAndMoves.scanLogs().then(() => {
  console.log("Logs were scanned", {
    uploadsCount: digg(countUploadsAndMoves, "uploadsCount"),
    movesCount: digg(countUploadsAndMoves, "movesCount")
  })
})
