export class IFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | IFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
