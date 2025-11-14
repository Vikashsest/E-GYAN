import { google } from 'googleapis';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleDriveService {
  private oauth2Client = new google.auth.OAuth2(
    // process.env.GOOGLE_CLIENT_ID,       // tumhara OAuth Client ID
    // process.env.GOOGLE_CLIENT_SECRET,   // tumhara OAuth Client Secret
    // process.env.GOOGLE_REDIRECT_URI     // backend callback URI
    "630816969465-o4ipfuiofnar416qodee4890cv947552.apps.googleusercontent.com",
    "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",
     "http://localhost:5000/current-affairs/oauth2callback"
  );

  constructor() {

  }

  private bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async uploadFile(file: Express.Multer.File, folderId?: string) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const fileMetadata: any = { name: file.originalname };
    if (folderId) fileMetadata.parents = [folderId];

    const media = { mimeType: file.mimetype, body: this.bufferToStream(file.buffer) };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
      fileId: response.data.id!,
      viewLink: response.data.webViewLink!,
      downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`,
    };
  }

  generateAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/drive.file'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }
}
