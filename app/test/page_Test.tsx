import React from "react";
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../group-route/page'

test('Edit Group Button', () => {
    render(<Page />)
    expect(screen.getByRole('button', { name: /edit group/i })).toBeDefined()
})