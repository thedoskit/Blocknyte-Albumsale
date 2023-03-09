import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    const fileName = 'blocknytes.zip';
    const filePath = path.join(process.cwd(), 'public', 'download', fileName);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      console.error('Error: File not found.');
      return res.status(404).json({ error: 'File not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json({});
  }
}