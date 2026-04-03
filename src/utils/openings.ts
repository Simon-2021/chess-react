/**
 * Chess Opening Library
 * Maps move sequence prefixes to opening names
 */

interface Opening {
  moves: string  // space-separated SAN moves
  name: string
  eco?: string   // ECO code
}

const OPENINGS: Opening[] = [
  // E-pawn openings
  { moves: 'e4', name: 'King\'s Pawn Opening', eco: 'B00' },
  { moves: 'e4 e5', name: 'Open Game', eco: 'C20' },
  { moves: 'e4 e5 Nf3', name: 'King\'s Knight Opening', eco: 'C40' },
  { moves: 'e4 e5 Nf3 Nc6', name: 'Open Game (Main)', eco: 'C44' },
  { moves: 'e4 e5 Nf3 Nc6 Bb5', name: 'Ruy Lopez (Spanish Opening)', eco: 'C60' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4', name: 'Italian Game', eco: 'C50' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5', name: 'Giuoco Piano', eco: 'C50' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6', name: 'Two Knights Defense', eco: 'C55' },
  { moves: 'e4 e5 Nf3 Nc6 d4', name: 'Scotch Game', eco: 'C44' },
  { moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4', name: 'Scotch Game', eco: 'C45' },
  { moves: 'e4 e5 f4', name: 'King\'s Gambit', eco: 'C30' },
  { moves: 'e4 e5 f4 exf4', name: 'King\'s Gambit Accepted', eco: 'C33' },
  { moves: 'e4 e5 Nc3', name: 'Vienna Game', eco: 'C25' },
  { moves: 'e4 c5', name: 'Sicilian Defense', eco: 'B20' },
  { moves: 'e4 c5 Nf3', name: 'Sicilian Defense - Open', eco: 'B40' },
  { moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6', name: 'Sicilian Dragon', eco: 'B70' },
  { moves: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4', name: 'Sicilian - Open', eco: 'B60' },
  { moves: 'e4 c5 Nc3', name: 'Sicilian - Closed', eco: 'B23' },
  { moves: 'e4 e6', name: 'French Defense', eco: 'C00' },
  { moves: 'e4 e6 d4', name: 'French Defense - Main', eco: 'C10' },
  { moves: 'e4 e6 d4 d5', name: 'French Defense', eco: 'C11' },
  { moves: 'e4 c6', name: 'Caro-Kann Defense', eco: 'B10' },
  { moves: 'e4 c6 d4 d5', name: 'Caro-Kann Defense', eco: 'B12' },
  { moves: 'e4 d5', name: 'Scandinavian Defense', eco: 'B01' },
  { moves: 'e4 d5 exd5 Qxd5', name: 'Scandinavian Defense - Main', eco: 'B01' },
  { moves: 'e4 d6', name: 'Pirc Defense', eco: 'B07' },
  { moves: 'e4 g6', name: 'Modern Defense', eco: 'B06' },
  { moves: 'e4 Nf6', name: 'Alekhine Defense', eco: 'B02' },

  // D-pawn openings
  { moves: 'd4', name: 'Queen\'s Pawn Opening', eco: 'D00' },
  { moves: 'd4 d5', name: 'Queen\'s Pawn Game', eco: 'D00' },
  { moves: 'd4 d5 c4', name: 'Queen\'s Gambit', eco: 'D06' },
  { moves: 'd4 d5 c4 dxc4', name: 'Queen\'s Gambit Accepted', eco: 'D20' },
  { moves: 'd4 d5 c4 e6', name: 'Queen\'s Gambit Declined', eco: 'D30' },
  { moves: 'd4 d5 c4 e6 Nc3 Nf6', name: 'Queen\'s Gambit Declined - Main', eco: 'D35' },
  { moves: 'd4 Nf6', name: 'Indian Defense', eco: 'A45' },
  { moves: 'd4 Nf6 c4', name: 'Indian System', eco: 'E10' },
  { moves: 'd4 Nf6 c4 e6', name: 'Nimzo/Queen\'s Indian', eco: 'E10' },
  { moves: 'd4 Nf6 c4 e6 Nc3 Bb4', name: 'Nimzo-Indian Defense', eco: 'E20' },
  { moves: 'd4 Nf6 c4 g6', name: 'King\'s Indian Setup', eco: 'E60' },
  { moves: 'd4 Nf6 c4 g6 Nc3 Bg7', name: 'King\'s Indian Defense', eco: 'E61' },
  { moves: 'd4 Nf6 Nf3 g6 c4 Bg7', name: 'King\'s Indian Defense', eco: 'E60' },
  { moves: 'd4 f5', name: 'Dutch Defense', eco: 'A80' },

  // English/Flank openings
  { moves: 'c4', name: 'English Opening', eco: 'A10' },
  { moves: 'c4 e5', name: 'English Opening - Reversed Sicilian', eco: 'A20' },
  { moves: 'Nf3', name: 'Réti Opening', eco: 'A04' },
  { moves: 'g3', name: 'King\'s Fianchetto Opening', eco: 'A00' },
  { moves: 'b3', name: 'Nimzovich-Larsen Attack', eco: 'A01' },
]

/**
 * Identify opening from move history (SAN moves)
 */
export function identifyOpening(sans: string[]): Opening | null {
  if (sans.length === 0) return null

  // Try to match longest prefix first
  let bestMatch: Opening | null = null
  const moveStr = sans.join(' ')

  for (const opening of OPENINGS) {
    if (moveStr.startsWith(opening.moves) || opening.moves === moveStr) {
      if (!bestMatch || opening.moves.length > bestMatch.moves.length) {
        bestMatch = opening
      }
    }
  }

  return bestMatch
}
