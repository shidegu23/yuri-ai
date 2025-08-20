import { supabaseServer } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const deviceId = parseInt(id);
    
    if (isNaN(deviceId)) {
      return NextResponse.json(
        { error: 'Invalid device ID' }, 
        { status: 400 }
      );
    }

    // 更新设备状态为维护模式
    const { data, error } = await supabaseServer
      .from('devices')
      .update({ status: 'maintenance' })
      .eq('id', deviceId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to recall device' }, 
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
      message: '设备召回指令已发送',
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