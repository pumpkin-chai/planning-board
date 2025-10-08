import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/group-view/page'

test('Add Group Render', () => {
    render(<Page />)
    expect(screen.getByRole('button', { name: /Add Group/i })).toBeDefined()
})
