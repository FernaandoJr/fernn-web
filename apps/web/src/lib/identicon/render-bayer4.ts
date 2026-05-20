export type IdenticonScheme = "oklch-mono" | "hsl-triadic"

type Rgb = [number, number, number]
type HashPair = [number, number]

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function hashString(str: string): HashPair {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return [h1 >>> 0, h2 >>> 0]
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hsl(h: number, s: number, l: number): Rgb {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ]
}

function deriveHue(hash: HashPair): number {
  const bytes: number[] = []
  for (let i = 0; i < 4; i++) {
    bytes.push((hash[0] >> (i * 8)) & 0xff)
    bytes.push((hash[1] >> (i * 8)) & 0xff)
  }
  return bytes.reduce((a, b) => a + b, 0) % 360
}

function oklchToRgb(L: number, C: number, H: number): Rgb {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_
  let R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  let G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  let B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  const gamma = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return [
    Math.round(Math.max(0, Math.min(1, gamma(R))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(G))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(B))) * 255),
  ]
}

function getColors(hash: HashPair, scheme: IdenticonScheme): [Rgb, Rgb] {
  const hue = deriveHue(hash)
  if (scheme === "hsl-triadic") {
    return [hsl(hue, 95, 50), hsl((hue + 120) % 360, 95, 50)]
  }
  return [oklchToRgb(0.8, 0.18, hue), oklchToRgb(0.45, 0.18, hue)]
}

function setPixel(
  img: ImageData,
  i: number,
  r: number,
  g: number,
  b: number,
) {
  const p = i * 4
  img.data[p] = r
  img.data[p + 1] = g
  img.data[p + 2] = b
  img.data[p + 3] = 255
}

export function renderIdenticon(
  ctx: CanvasRenderingContext2D,
  size: number,
  seed: string,
  scheme: IdenticonScheme = "oklch-mono",
) {
  const hash = hashString(seed)
  const rng = mulberry32(hash[0])
  const [rgb1, rgb2] = getColors(hash, scheme)
  const angle = rng() * Math.PI * 2
  const img = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = Math.max(
        0,
        Math.min(
          1,
          ((x / size - 0.5) * Math.cos(angle) +
            (y / size - 0.5) * Math.sin(angle)) +
            0.5,
        ),
      )
      const pick = t > BAYER_4X4[y % 4]![x % 4]! / 16 ? rgb1 : rgb2
      setPixel(img, y * size + x, pick[0], pick[1], pick[2])
    }
  }
  ctx.putImageData(img, 0, 0)
}

export function renderIdenticonToDataUrl(
  seed: string,
  size = 32,
  scheme: IdenticonScheme = "oklch-mono",
): string {
  if (typeof document === "undefined") {
    return ""
  }
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return ""
  }
  renderIdenticon(ctx, size, seed, scheme)
  return canvas.toDataURL("image/png")
}
