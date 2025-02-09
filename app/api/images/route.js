import { NextResponse } from 'next/server';
import images from '../../../public/data/images.json';

export async function GET() {
  return NextResponse.json(images);
}
