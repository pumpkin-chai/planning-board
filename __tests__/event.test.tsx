import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/event-proposal/page'
 
test('Propose Event Button Rendered', () => {
  render(<Page />)
  expect(screen.getByRole('button', { name: /Propose Event/i })).toBeDefined()
})