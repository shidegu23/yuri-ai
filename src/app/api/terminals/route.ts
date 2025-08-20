import { supabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/terminals - 获取所有终端
export async function GET(request: NextRequest) {
  try {
    const { data: terminals, error } = await supabaseServer
      .from('terminals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(terminals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/terminals - 创建新终端
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: terminal, error } = await supabaseServer
      .from('terminals')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(terminal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}