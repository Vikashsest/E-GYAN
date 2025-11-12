import { google } from 'googleapis';
import { Readable } from 'stream';

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadToGoogleDrive(file: Express.Multer.File, folderId?: string) {
  const fileMetadata: any = { name: file.originalname };
  if (folderId) fileMetadata.parents = [folderId];

  const media = { mimeType: file.mimetype, body: bufferToStream(file.buffer) };

  const response = await drive.files.create({
    requestBody: fileMetadata, 
    media,
    fields: 'id, webViewLink, webContentLink',
  });


  await drive.permissions.create({
    fileId: response.data?.id!,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return {
    fileId: response.data?.id!,
    viewLink: response.data?.webViewLink!,
    downloadLink: `https://drive.google.com/uc?export=download&id=${response.data?.id}`,
  };
}
