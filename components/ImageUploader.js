import { useState } from "react";
import Loader from "./Loader";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, STATE_CHANGED, storage } from "../lib/firebase";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  //   *Create a Firebase upload task
  const uploadFile = async (e) => {
    // *1. Get the uploaded file
    // Do we have to do "const file = Array.from(e.target.files)[0]"? -> doesn't look like it
    const file = e.target.files[0];

    // Extracting file format since it's originally stored like that: "type: "image/png""
    const extension = file.type.split("/")[1];

    // *2. Make reference to the storage bucket location (where the file will be stored)
    const storageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // *3. Start the upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      STATE_CHANGED,
      (snapshot) => {
        const pct = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        setProgress(pct);
      },
      (err) => console.log(err),

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} />

      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snipper">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
