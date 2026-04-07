import { getStore } from '@netlify/blobs';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function verifyAdminToken(token: string): boolean {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  try {
    const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (sig !== sigB64) return false;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    return typeof payload.exp === 'number' && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

// POST — public endpoint, called when a customer submits a questionnaire
export async function POST(request: NextRequest) {
  try {
    const response = await request.json();
    if (!response.id || !response.questionnaireId) {
      return NextResponse.json({ error: 'Invalid response data' }, { status: 400 });
    }
    const store = getStore('questionnaire-responses');
    await store.setJSON(response.id, response);
    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}

// GET — admin only, returns all submitted responses
export async function GET(request: NextRequest) {
  const token = request.cookies.get('c21_admin_token')?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const store = getStore('questionnaire-responses');
    const { blobs } = await store.list();
    const responses = await Promise.all(
      blobs.map(b => store.get(b.key, { type: 'json' }))
    );
    return NextResponse.json(responses.filter(Boolean));
  } catch (error) {
    console.error('Error fetching responses:', error);
    // Return empty array gracefully (e.g. in local dev where Blobs isn't available)
    return NextResponse.json([]);
  }
}

// DELETE — admin only, deletes a response by id
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('c21_admin_token')?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const store = getStore('questionnaire-responses');
    await store.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
  }
}
