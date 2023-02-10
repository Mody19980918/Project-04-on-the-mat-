import formidable, { Fields, Files } from "formidable";
import express from "express";
import IncomingForm from "formidable/Formidable";


const uploadDir = "uploads";
// fs.mkdirSync(uploadDir, { recursive: true });


//

export const form = formidable({
  uploadDir,
  maxFiles: 1,
  maxFileSize: 2000 * 1024 ** 60000, // the default limit is 6000KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
  filename: (originalName, originalExt, part, form) => {
    let fieldName = part.name;
    let timestamp = Date.now();
    let ext = part.mimetype?.split("/").pop();
    return `${fieldName}-${timestamp}.${ext}`;
  },
});

export function formParse(form: IncomingForm, req: express.Request) {
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export function toArray<T>(field: T[] | T | undefined): T[] {
  if (Array.isArray(field)) {
    return field;
  }

  if (!field) {
    return [];
  }

  return [field];
}
