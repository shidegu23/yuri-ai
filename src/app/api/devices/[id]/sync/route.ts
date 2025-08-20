import { supabaseServer } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deviceId = parseInt(params.id);
    
    if (isNaN(deviceId)) {
      return NextResponse.json(
        { error: 'Invalid device ID' }, 
        { status: 400 }
      );
    }

    // 更新设备最后同步时间
    const { data, error } = await supabaseServer
      .from('devices')
      .update({ 
        last_sync_at: new Date().toISOString(),
        status: 'online' 
      })
      .eq('id', deviceId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to sync device' }, 
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Device not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: '设备同步指令已发送',
      device: data 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}