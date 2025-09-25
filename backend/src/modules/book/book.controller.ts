import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Req,
  NotFoundException,
  HttpException,
  Res,
  HttpStatus,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/common/utils/multer";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/role.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { User, UserRole } from "../user/entities/user.entity";
import { Response, Request } from "express";
import axios from "axios";
import { pipeline } from "stream";
import { promisify } from "util";
import * as https from "https";
import * as http from "http";

const streamPipeline = promisify(pipeline);

interface CustomRequest extends Request {
  user: User;
}

@Controller("books")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ✅ Dashboard stats
  @Get("dashboard-stats")
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  async getStats() {
    return this.bookService.getDashboardStats();
  }

  // ✅ Uploaded by user
  @Get("uploaded-by")
  async uploadedBy(@Req() req: CustomRequest) {
    const userId = req.user?.id;
    return this.bookService.findByUploaderId(userId);
  }

  // ✅ Upload book
  @Post("upload")
 @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "file", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
      ],
      multerConfig
    )
  )
  async uploadBook(
    @UploadedFiles()
    files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() createBookDto: CreateBookDto,
    @Req() req: CustomRequest
  ) {
    if (files.thumbnail?.[0]) {
      createBookDto.thumbnail = files.thumbnail[0].path || `uploads/${files.thumbnail[0].filename}`;
    }
    return this.bookService.createBook(createBookDto, req.user!);
  }

  // ✅ Proxy file (PDF/Video/Audio)
  // @Get("proxy/file")
  // async proxyFile(@Query("url") url: string, @Req() req: Request, @Res() res: Response) {
  //   if (!url) throw new BadRequestException("url query param required");

  //   try {
  //     if (url.includes("/index.php/s/") && !url.endsWith("/download")) {
  //       url = url.replace(/\/+$/, "") + "/download";
  //     }

  //     const headers: Record<string, string> = {};
  //     if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

  //     if (url.includes("/remote.php/dav")) {
  //       headers["Authorization"] =
  //         "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
  //     }

  //     const response = await axios.get(url, { headers, responseType: "stream", validateStatus: () => true });

  //     if (response.status >= 400) throw new NotFoundException("File not found");

  //     res.status(response.status);
  //     Object.entries(response.headers).forEach(([key, value]) => value && res.setHeader(key, value as string));

  //     await streamPipeline(response.data, res);
  //   } catch (err) {
  //     console.error("Proxy error:", err.message);
  //     throw new HttpException("Failed to fetch file", HttpStatus.BAD_GATEWAY);
  //   }
  // }
// BookController.ts
// @Get("proxy/file")
// async proxyFile(
//   @Query("url") url: string,
//   @Req() req: Request,
//   @Res() res: Response
// ) {
//   if (!url) throw new BadRequestException("url query param required");

//   try {
//     // Agar Nextcloud share link hai toh /download force karo
//     if (url.includes("/index.php/s/") && !url.endsWith("/download")) {
//       url = url.replace(/\/+$/, "") + "/download";
//     }

//     const headers: Record<string, string> = {};
//     if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

//     const response = await axios.get(url, {
//       headers,
//       responseType: "stream",
//       validateStatus: () => true,
//     });

//     if (response.status >= 400) {
//       throw new NotFoundException("File not found");
//     }

//     res.status(response.status);
//     Object.entries(response.headers).forEach(([key, value]) => {
//       if (value) res.setHeader(key, value as string);
//     });

//     await streamPipeline(response.data, res);
//   } catch (err) {
//     console.error("Proxy error:", err.message);
//     throw new HttpException("Failed to fetch file", HttpStatus.BAD_GATEWAY);
//   }
// }

@Get('proxy/file')
async proxyFile(
  @Query('url') url: string,
  @Req() req: Request,
  @Res() res: Response,
) {
  if (!url) throw new BadRequestException('url query param required');

  try {
    // Nextcloud share link adjustment
    if (url.includes('/index.php/s/') && !url.endsWith('/download')) {
      url = url.replace(/\/+$/, '') + '/download';
    }

    const headers: Record<string, string> = {};
    if (req.headers['range']) headers['Range'] = req.headers['range'] as string;

    // Agar DAV API use ho rahi hai toh auth headers bhejna
    if (url.includes('/remote.php/dav')) {
      headers['Authorization'] =
        'Basic ' +
        Buffer.from(
          `${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`,
        ).toString('base64');
    }

    const response = await axios.get(url, {
      headers,
      responseType: 'stream',
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      throw new NotFoundException('File not found');
    }

    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      if (value) res.setHeader(key, value as string);
    });

    await streamPipeline(response.data, res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
  }
}



//  @Get('proxy/file')
//   async proxyFile(
//     @Query('url') url: string,
//     @Req() req: Request,
//     @Res() res: Response,
//   ) {
//     if (!url) throw new BadRequestException('url query param required');

//     try {
//       // Nextcloud share link adjustment
//       if (url.includes('/index.php/s/') && !url.endsWith('/download')) {
//         url = url.replace(/\/+$/, '') + '/download';
//       }

//       const client = url.startsWith('https') ? https : http;
//       const requestOptions = { headers: req.headers };

//       client.get(url, requestOptions, (response) => {
//         if (response.statusCode && response.statusCode >= 400) {
//           res.status(response.statusCode).send('File not found');
//           return;
//         }

//         // Pass headers (Content-Type, Content-Length, etc.)
//         Object.entries(response.headers).forEach(([key, value]) => {
//           if (value) res.setHeader(key, value as string);
//         });

//         // Pipe streaming response directly
//         response.pipe(res);
//       }).on('error', (err: any) => {
//         if (err.code === 'ECONNRESET') {
//           console.warn('Client aborted request');
//           return;
//         }
//         console.error('Proxy file error:', err.message);
//         if (!res.headersSent) res.status(502).send('Failed to fetch file');
//       });

//     } catch (err: any) {
//       console.error('Proxy file outer error:', err.message);
//       if (!res.headersSent) res.status(502).send('Failed to fetch file');
//     }
//   }


@Get('education-levels')
async getEducationLevels() {
  return this.bookService.findAllEducationLevels();
}
@Get('category')
async getCategory(){
  return this.bookService.getCategories()
}
  // ✅ Proxy thumbnail
  // @Get("proxy/thumbnail")
  // async proxyThumbnail(@Query("url") url: string, @Res() res: Response) {
  //   if (!url) throw new BadRequestException("url query param required");

  //   try {
  //     const headers: Record<string, string> = {};
  //     if (url.includes("/remote.php/dav")) {
  //       headers["Authorization"] =
  //         "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
  //     }

  //     const response = await axios.get(url, { headers, responseType: "stream", validateStatus: () => true });

  //     if (response.status >= 400) throw new NotFoundException("Thumbnail not found");

  //     res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
  //     await streamPipeline(response.data, res);
  //   } catch (err) {
  //     console.error("Thumbnail fetch error:", err.message);
  //     throw new NotFoundException("Thumbnail not found");
  //   }
  // }
   @Get("proxy/thumbnail")
  async proxyThumbnail(@Query("url") url: string, @Res() res: Response) {
    if (!url) throw new BadRequestException("url query param required");

    try {
      const client = url.startsWith("https") ? https : http;
      client.get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          res.status(response.statusCode).send("Thumbnail not found");
          return;
        }

        res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
        response.pipe(res);
      }).on("error", (err: any) => {
        if (err.code === "ECONNRESET") {
          console.warn("Client aborted thumbnail request");
          return;
        }
        console.error("Proxy thumbnail error:", err.message);
        if (!res.headersSent) res.status(502).send("Failed to fetch thumbnail");
      });
    } catch (err: any) {
      console.error("Proxy thumbnail outer error:", err.message);
      if (!res.headersSent) res.status(502).send("Failed to fetch thumbnail");
    }
  }

  @Get(":id/chapters/meta")
  async getChaptersMeta(@Param("id") bookId: string) {
    return this.bookService.getChaptersMeta(+bookId);
  }

  @Get(":id/chapters")
  async getChapters(@Param("id") bookId: string) {
    const id = Number(bookId);
    if (isNaN(id)) throw new BadRequestException("Invalid bookId");
    return this.bookService.getChaptersByBookId(id);
  }

  @Get(":id")
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
  async getBookById(@Param("id") id: string) {
    const book = await this.bookService.findOneById(+id);
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }
  @Post(":id/chapters")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "file", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 },
        { name: "audio", maxCount: 1 },
      ],
      multerConfig
    )
  )
  async addChapter(
    @Param("id") bookId: string,
    @UploadedFiles() files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() body: { chapterNumber: number }
  ) {
    return this.bookService.addChapter(+bookId, body, files.file?.[0], files.thumbnail?.[0]);
  }

  // ✅ Update book
  @Patch(":id")
  // @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  @UseInterceptors(FileInterceptor("pdf"))
  update(@Param("id") id: string, @UploadedFile() file: Express.Multer.File, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(+id, dto, file);
  }

  // ✅ Delete book & chapter
  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  async deleteBook(@Param("id") id: number) {
    return this.bookService.remove(id);
  }

  @Delete("chapter/:id")
  async deleteChapter(@Param("id", ParseIntPipe) id: number) {
    return this.bookService.deleteChapter(id);
  }

  // ✅ Chapter file stream
@Get(":id/chapters/:chapterId/file")
async getChapterFile(
  @Param("id") bookId: string,
  @Param("chapterId") chapterId: string,
  @Res() res: Response,
  @Req() req: Request
) {
  const fileUrl = await this.bookService.getChapterFileStream(+bookId, +chapterId);
  if (!fileUrl) throw new NotFoundException("File not found");

  const headers: any = {};
  if (req.headers["range"]) {
    headers["Range"] = req.headers["range"] as string;
  }

  // Remote authorization agar needed ho
  if (fileUrl.includes("/remote.php/dav")) {
    headers["Authorization"] =
      "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
  }

  const response = await axios.get(fileUrl, {
    headers,
    responseType: "stream",
    validateStatus: () => true,
  });

  // Headers fix for PDF.js
  res.setHeader("Content-Disposition", "inline; filename=chapter.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Accept-Ranges", "bytes");

  // Forward remote headers (like Content-Length)
  Object.entries(response.headers).forEach(([key, value]) => {
    if (value && !["content-disposition", "content-type"].includes(key.toLowerCase())) {
      res.setHeader(key, value as string);
    }
  });

  await streamPipeline(response.data, res);
}



  @Get()
  findAll() {
    return this.bookService.findAll();
  }
 

}
