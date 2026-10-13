export type Controls = {
  forward: number
  turn: number
  brake: boolean
  respawn: boolean
}

const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
  space: false,
  r: false,
}

const stick = {
  x: 0,
  y: 0,
  active: false,
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function onKey(e: KeyboardEvent, down: boolean) {
  if (isTypingTarget(e.target)) return
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.w = down
      e.preventDefault()
      break
    case 'KeyS':
    case 'ArrowDown':
      keys.s = down
      e.preventDefault()
      break
    case 'KeyA':
    case 'ArrowLeft':
      keys.a = down
      e.preventDefault()
      break
    case 'KeyD':
    case 'ArrowRight':
      keys.d = down
      e.preventDefault()
      break
    case 'Space':
      keys.space = down
      e.preventDefault()
      break
    case 'KeyR':
      keys.r = down
      break
    default:
      break
  }
}

let bound = false

export function bindKeyboard() {
  if (bound || typeof window === 'undefined') return () => {}
  bound = true
  const down = (e: KeyboardEvent) => onKey(e, true)
  const up = (e: KeyboardEvent) => onKey(e, false)
  window.addEventListener('keydown', down, { passive: false })
  window.addEventListener('keyup', up)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    bound = false
  }
}

export function setStick(x: number, y: number, active: boolean) {
  stick.x = x
  stick.y = y
  stick.active = active
}

export function readControls(): Controls {
  if (stick.active) {
    return {
      forward: -stick.y,
      turn: -stick.x,
      brake: keys.space,
      respawn: keys.r,
    }
  }
  return {
    forward: (keys.w ? 1 : 0) + (keys.s ? -1 : 0),
    turn: (keys.a ? 1 : 0) + (keys.d ? -1 : 0),
    brake: keys.space,
    respawn: keys.r,
  }
}
