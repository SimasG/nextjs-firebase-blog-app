import { useState } from "react";
import Loader from "./Loader";
import { ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../lib/firebase";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  //   *Create a Firebase upload task
  const uploadFile = async (e) => {
    console.log("uploadFile func ran");
    // *1. Get the uploaded file
    // Do we have to do "const file = Array.from(e.target.files)[0]"?
    // const file = e.target.files[0];
    // Extracting file format since it's originally stored like that: "type: "image/png""
    // const extension = file.type.split("/")[1];

    // *2. Make reference to the storage bucket location (where the file will be stored)
    // const storageRef = ref(
    //   storage,
    //   "uploads",
    //   auth.currentUser.uid,
    //   Date.now().extension
    // );
    // setUploading(true);

    // *3. Start the upload
    // uploadBytes(storageRef, file);
    //   .then((snapshot) => {
    //     console.log(snapshot);
    //     console.log("file is supposedly uploaded");
    //   })
    //   .then(setUploading(false));
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
