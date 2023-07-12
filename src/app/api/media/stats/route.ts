import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import db from '../../../../database/connect';




export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const bookStats = await getBookStats();
  return NextResponse.json(bookStats);
}


async function getBookStats() {
  // Count the number of books in database
  const bookCount = await db('media').count('id as count').first();
  // Count the number of series in database
  const seriesCount = await db('series').count('id as count').first();
  // Count the number of tags in database
  const tagCount = await db('tags').count('id as count').first();
  // Add the number of size of all books in database
  const size = await db('media_info').sum('size as size').first();

  // return all the stats
  return {
    bookCount: bookCount != null ? bookCount.count : 0,
    seriesCount: seriesCount != null ? seriesCount.count : 0,
    tagCount: tagCount != null ? tagCount.count : 0,
    size: size != null ? size.size : 0
  };
}
