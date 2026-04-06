import { NextRequest, NextResponse } from 'next/server';
import { getUsers, hashPassword } from '@/lib/store/user-store';

const users = getUsers();

export async function GET() {
  const userList = Object.entries(users).map(([username, data]) => ({
    username,
    role: data.role,
    createdAt: data.createdAt,
  }));
  return NextResponse.json({ users: userList });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const key = username.toLowerCase().trim();

    if (key.length < 2) {
      return NextResponse.json({ error: 'Username must be at least 2 characters' }, { status: 400 });
    }

    if (users[key]) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    users[key] = {
      password: hashPassword(password),
      role: role || 'admin',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: 'User created', username: key });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const key = username.toLowerCase();

    if (!users[key]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting the last admin
    const adminCount = Object.values(users).filter(u => u.role === 'admin').length;
    if (users[key].role === 'admin' && adminCount <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 });
    }

    delete users[key];
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const key = username.toLowerCase();

    if (!users[key]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (password) {
      users[key].password = hashPassword(password);
    }
    if (role) {
      users[key].role = role;
    }

    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
