import { NextResponse } from 'next/server'

type ErrorPayload = {
    error: string
    code?: string
    details?: unknown
}

export function apiError(
    status: number,
    error: string,
    code?: string,
    details?: unknown
) {
    const payload: ErrorPayload = { error }
    if (code) payload.code = code
    if (details !== undefined) payload.details = details
    return NextResponse.json(payload, { status })
}
