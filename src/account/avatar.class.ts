export class AFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | AFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
