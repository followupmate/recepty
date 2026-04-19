let pendingFile = null;

export function setPendingUploadFile(file) {
  pendingFile = file;
}

export function consumePendingUploadFile() {
  const file = pendingFile;
  pendingFile = null;
  return file;
}
